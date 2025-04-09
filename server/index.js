import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { authenticate } from './middleware/auth.js';
import configureWebRTC from './services/webrtc.js';
import Message from './models/Message.js';

// Server Configuration
const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: process.env.NODE_ENV === 'development'
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB cluster'));

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// Security Middleware
if (process.env.NODE_ENV === 'production') {
  app.use(require('helmet')());
  app.use(require('compression')());
  app.use(require('express-rate-limit')({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }));
}

// API Routes
app.use('/auth', require('./routes/auth.js'));
app.use('/messages', authenticate(['user', 'admin']), require('./routes/messages.js'));

// WebRTC Signaling Server
const server = http.createServer(app);
configureWebRTC(server);

// Error Handling
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// Server Initialization
server.listen(PORT, () => {
  console.log(`
  🚀 Server running in ${process.env.NODE_ENV || 'development'} mode
  📡 Listening on port ${PORT}
  🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Configured' : 'Missing!'}
  `);
});
