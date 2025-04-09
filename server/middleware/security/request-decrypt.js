import { CryptoEngine } from '../crypto-engine';
import { SecurityLogger } from '../security-logger';

const DECRYPTION_HEADERS = {
  IV: 'x-encryption-iv',
  AUTH_TAG: 'x-encryption-auth-tag',
  KEY_VERSION: 'x-key-version'
};

export const requestDecryptor = async (req, res, next) => {
  try {
    if (!req.headers[DECRYPTION_HEADERS.IV] || 
        !req.headers[DECRYPTION_HEADERS.AUTH_TAG]) {
      throw new SecurityError('MISSING_CRYPTO_HEADERS');
    }

    const encryptionConfig = {
      iv: Buffer.from(req.headers[DECRYPTION_HEADERS.IV], 'base64'),
      authTag: Buffer.from(req.headers[DECRYPTION_HEADERS.AUTH_TAG], 'base64'),
      keyVersion: req.headers[DECRYPTION_HEADERS.KEY_VERSION] || '2025a'
    };

    const sessionKey = await CryptoEngine.getSessionKey(
      req.session.id,
      encryptionConfig.keyVersion
    );

    if (!sessionKey) {
      throw new SecurityError('INVALID_SESSION_KEY');
    }

    const decryptedBody = await CryptoEngine.decrypt(
      req.body,
      sessionKey,
      encryptionConfig
    );

    req.secureBody = JSON.parse(decryptedBody.toString('utf8'));
    
    // Security validation
    if (req.secureBody._securityHash !== CryptoEngine.generateBodyHash(req.secureBody)) {
      await SecurityLogger.log('BODY_TAMPER', { ip: req.ip });
      throw new SecurityError('REQUEST_TAMPERED');
    }

    next();
  } catch (error) {
    res.status(401).json({
      error: 'SECURITY_FAILURE',
      message: 'Request decryption failed',
      code: error instanceof SecurityError ? error.message : 'GENERIC_FAILURE'
    });
  }
};
