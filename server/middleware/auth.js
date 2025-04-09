import jwt from 'jsonwebtoken';
import { Security } from '../utils/cryptoEngine';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).send('No token provided');

  try {
    const decoded = jwt.verify(
      Security.decryptToken(token),
      process.env.JWT_SECRET
    );
    
    req.userId = decoded.userId;
    req.sessionKey = decoded.sessionKey;
    next();
  } catch (error) {
    res.status(401).send('Invalid token');
  }
};

export const checkSession = async (req, res, next) => {
  const sessionHash = Security.hashData(req.sessionKey);
  const validSession = await SessionManager.validateSession(
    req.userId, 
    sessionHash
  );
  
  if (!validSession) return res.status(401).send('Session expired');
  next();
};
