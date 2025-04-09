import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many attempts, please try again later'
});

// Registration Endpoint
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { username, password, role = 'user' } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }

    // Check existing user
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = await User.create({ 
      username,
      password: hashedPassword,
      role,
      activeSessions: []
    });

    // Generate tokens
    const accessToken = jwt.sign(
      { sub: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
      { sub: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Store session
    user.activeSessions.push(refreshToken);
    await user.save();

    res.status(201).json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login Endpoint
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { sub: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
      { sub: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Update sessions
    user.activeSessions.push(refreshToken);
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Token Refresh Endpoint
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    // Verify token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.sub,
      activeSessions: refreshToken
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Issue new access token
    const newAccessToken = jwt.sign(
      { sub: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ error: 'Token refresh failed' });
  }
});

export default router;
