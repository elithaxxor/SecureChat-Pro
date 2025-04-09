import { CryptoEngine } from '../crypto-engine';
import { SecurityHeaders } from '../security-headers';

export const responseEncryptor = async (req, res, next) => {
  const originalSend = res.send;

  res.send = async (body) => {
    try {
      const sessionKey = await CryptoEngine.getSessionKey(
        req.session.id,
        '2025a' // Current key version
      );

      if (!sessionKey) {
        throw new SecurityError('NO_VALID_SESSION_KEY');
      }

      const securityHash = CryptoEngine.generateBodyHash(body);
      const bodyWithSecurity = {
        ...body,
        _securityHash: securityHash,
        _timestamp: Date.now()
      };

      const { encryptedData, iv, authTag } = await CryptoEngine.encrypt(
        JSON.stringify(bodyWithSecurity),
        sessionKey
      );

      SecurityHeaders.setEncryptionHeaders(res, {
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64'),
        keyVersion: '2025a'
      });

      originalSend.call(res, encryptedData);
    } catch (error) {
      SecurityHeaders.setSecurityErrorHeaders(res);
      originalSend.call(res, {
        error: 'ENCRYPTION_FAILURE',
        message: 'Failed to secure response'
      });
    }
  };

  next();
};
