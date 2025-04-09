import { Router } from 'express';
import Message from '../models/Message.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Create Encrypted Message
router.post('/', authenticate(), async (req, res) => {
  try {
    const { encryptedContent, iv, participants } = req.body;
    
    // Validate participants
    if (!participants.includes(req.user.id)) {
      return res.status(403).json({ error: 'Invalid conversation participants' });
    }

    // Create message document
    const message = await Message.create({
      sessionId: req.user.session,
      encryptedContent,
      iv,
      participants,
      metadata: {
        sentAt: new Date(),
        sender: req.user.id
      }
    });

    res.status(201).json({
      id: message._id,
      sentAt: message.metadata.sentAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Message creation failed' });
  }
});

// Retrieve Messages with Pagination
router.get('/', authenticate(), async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    
    const messages = await Message.find({
      participants: req.user.id,
      'metadata.sentAt': { $lt: new Date() }
    })
    .sort({ 'metadata.sentAt': -1 })
    .limit(limit)
    .skip((page - 1) * limit)
    .lean();

    res.json(messages.map(msg => ({
      id: msg._id,
      content: msg.encryptedContent,
      iv: msg.iv,
      sender: msg.metadata.sender,
      sentAt: msg.metadata.sentAt
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
});

// Message Metadata Update
router.patch('/:id', authenticate(), async (req, res) => {
  try {
    const update = {};
    
    if (req.body.delivered) {
      update['metadata.deliveredAt'] = new Date();
    }
    
    if (req.body.read) {
      update['metadata.readAt'] = new Date();
    }

    const message = await Message.findOneAndUpdate(
      { _id: req.params.id, participants: req.user.id },
      { $set: update },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({
      deliveredAt: message.metadata.deliveredAt,
      readAt: message.metadata.readAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

export default router;
