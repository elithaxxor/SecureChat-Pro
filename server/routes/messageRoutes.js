import express from 'express';
import { Security } from '../utils/cryptoEngine';
import Message from '../models/Message';

const router = express.Router();

router.post('/', Security.verifyClient, async (req, res) => {
  try {
    const { encryptedContent, recipients } = req.body;
    
    // Validate message format
    Security.validateEncryptedPayload(encryptedContent);
    
    const message = await Message.create({
      content: encryptedContent,
      sender: req.userId,
      recipients: recipients.map(r => ({
        user: r.userId,
        decryptionKey: Security.encryptForRecipient(r.publicKey)
      }))
    });

    res.status(201).json({
      messageId: Security.hashData(message.id),
      timestamp: message.createdAt
    });
  } catch (error) {
    res.status(400).send('Invalid message format');
  }
});

router.get('/:chatId', Security.verifyClient, async (req, res) => {
  try {
    const messages = await Message.find({
      chatId: Security.dehashData(req.params.chatId),
      $or: [
        { sender: req.userId },
        { 'recipients.user': req.userId }
      ]
    });

    res.json(messages.map(msg => ({
      id: Security.hashData(msg.id),
      content: msg.content,
      timestamp: msg.createdAt
    })));
  } catch (error) {
    res.status(404).send('Chat not found');
  }
});

router.delete('/:messageId', Security.verifyClient, async (req, res) => {
  try {
    const message = await Message.findOne({
      _id: Security.dehashData(req.params.messageId),
      sender: req.userId
    });

    if (!message) throw new Error('Message not found');
    
    await Message.findByIdAndUpdate(message._id, {
      content: Security.generateShredPayload(),
      recipients: []
    });

    res.sendStatus(204);
  } catch (error) {
    res.status(404).send('Message not found');
  }
});

export default router;
