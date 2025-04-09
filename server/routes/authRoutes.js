import express from 'express';
import { Security } from '../utils/cryptoEngine';
import { ErrorHandler } from '../utils/securityLogger';
import User from '../models/User';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { clientEphemeralKey, encryptedCredentials } = req.body;
    
    // Key exchange protocol
    const serverEphemeralKey = Security.generateECDHKey();
    const sharedSecret = Security.deriveSharedSecret(
      clientEphemeralKey,
      serverEphemeralKey.privateKey
    );

    const credentials = Security.decryptPayload(
      encryptedCredentials,
      sharedSecret
    );

    // Authentication logic
    const user = await User.findOne({ username: credentials.username });
    const keyValid = await bcrypt.compare(
      credentials.password,
      user.security.derivedKey
    );

    if (!keyValid) throw new Error('Invalid credentials');

    // Generate tokens
    const accessToken = Security.generateAccessToken(user);
    const refreshToken = Security.generateRefreshToken(user);

    res.json({
      accessToken: Security.encryptToken(accessToken, sharedSecret),
      refreshToken: Security.encryptToken(refreshToken, sharedSecret),
      serverPublicKey: serverEphemeralKey.publicKey
    });
  } catch (error) {
    ErrorHandler.logSecurityEvent({
      type: 'AUTH_FAILURE',
      metadata: error.message
    });
    res.status(401).send('Authentication failed');
  }
});

router.post('/refresh', Security.verifyClient, async (req, res) => {
  try {
    const { encryptedRefreshToken } = req.body;
    const refreshToken = Security.decryptToken(
      encryptedRefreshToken,
      req.sessionKey
    );

    const { userId } = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(userId);
    
    const newAccessToken = Security.generateAccessToken(user);
    res.json({
      accessToken: Security.encryptToken(newAccessToken, req.sessionKey)
    });
  } catch (error) {
    res.status(403).send('Invalid refresh token');
  }
});

router.delete('/logout', Security.verifyClient, async (req, res) => {
  try {
    await SessionManager.invalidateSession(req.userId, req.sessionKey);
    res.sendStatus(204);
  } catch (error) {
    ErrorHandler.logSecurityEvent({
      type: 'SESSION_FAILURE',
      userId: req.userId,
      metadata: error.message
    });
    res.status(500).send('Logout failed');
  }
});

export default router;
