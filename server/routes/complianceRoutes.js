import express from 'express';
import { Security } from '../utils/cryptoEngine';
import User from '../models/User';
import Message from '../models/Message';

const router = express.Router();

router.get('/export-data', Security.verifyClient, async (req, res) => {
  try {
    const userData = await User.findById(req.userId)
      .select('-security -sessions');
      
    const messages = await Message.find({
      $or: [
        { sender: req.userId },
        { 'recipients.user': req.userId }
      ]
    });

    const encryptedExport = Security.encryptExport({
      user: userData,
      messages: messages.map(msg => ({
        content: Security.decryptMessageForExport(msg.content),
        timestamp: msg.createdAt
      }))
    });

    res.json({
      exportId: Security.generateExportId(),
      data: encryptedExport,
      expiresAt: Date.now() + 3600000 // 1 hour
    });
  } catch (error) {
    res.status(500).send('Data export failed');
  }
});

router.delete('/erase-data', Security.verifyClient, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, {
      $set: {
        username: Security.generateDeletedIdentifier(),
        security: { derivedKey: Security.generateShredPayload() },
        sessions: []
      }
    });

    await Message.updateMany(
      { sender: req.userId },
      { $set: { content: Security.generateShredPayload() } }
    );

    res.sendStatus(204);
  } catch (error) {
    res.status(500).send('Data erasure failed');
  }
});

export default router;
