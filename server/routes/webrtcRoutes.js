import express from 'express';
import { Security } from '../utils/cryptoEngine';
import WebRTCSession from '../models/WebRTCSession';

const router = express.Router();

router.post('/initiate', Security.verifyClient, async (req, res) => {
  try {
    const { targetUserId, encryptedOffer } = req.body;
    
    const session = await WebRTCSession.create({
      initiator: req.userId,
      recipient: targetUserId,
      offer: Security.decryptForServer(encryptedOffer),
      security: {
        fingerprint: Security.generateDTLSFingerprint(),
        initiatedAt: Date.now()
      }
    });

    res.json({
      sessionId: Security.hashData(session.id),
      fingerprint: session.security.fingerprint
    });
  } catch (error) {
    res.status(400).send('Invalid call initiation');
  }
});

router.put('/signal/:sessionId', Security.verifyClient, async (req, res) => {
  try {
    const session = await WebRTCSession.findById(
      Security.dehashData(req.params.sessionId)
    );

    if (![session.initiator, session.recipient].includes(req.userId)) {
      throw new Error('Unauthorized signaling');
    }

    const decryptedSignal = Security.decryptSignal(req.body.encryptedSignal);
    
    await WebRTCSession.findByIdAndUpdate(session._id, {
      $push: { iceCandidates: decryptedSignal }
    });

    res.sendStatus(204);
  } catch (error) {
    res.status(403).send('Signal processing failed');
  }
});

router.get('/answer/:sessionId', Security.verifyClient, async (req, res) => {
  try {
    const session = await WebRTCSession.findById(
      Security.dehashData(req.params.sessionId)
    );

    if (session.recipient.toString() !== req.userId) {
      throw new Error('Unauthorized answer request');
    }

    res.json({
      answer: Security.encryptAnswer(session.answer),
      candidates: session.iceCandidates.map(c => 
        Security.encryptCandidate(c)
      )
    });
  } catch (error) {
    res.status(403).send('Answer retrieval failed');
  }
});

export default router;
