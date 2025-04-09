import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// ICE Server Configuration
router.get('/ice-servers', authenticate(), (req, res) => {
  res.json({
    iceServers: process.env.ICE_SERVERS.split(',').map(url => ({
      urls: url.trim()
    }))
  });
});

// Peer Connection Health Check
router.post('/health', authenticate(), (req, res) => {
  res.json({ status: 'active', timestamp: Date.now() });
});

export default router;
