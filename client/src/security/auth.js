import { webcrypto } from 'crypto';
import { SecureStorage } from './storage';

const CRYPTO_CONFIG = {
  name: 'AES-GCM',
  length: 256,
  iterations: 210000,
  salt: webcrypto.getRandomValues(new Uint8Array(16))
};

export const AuthManager = {
  async generateSessionKey() {
    const key = await webcrypto.subtle.generateKey(
      { name: CRYPTO_CONFIG.name, length: CRYPTO_CONFIG.length },
      true,
      ['encrypt', 'decrypt']
    );
    return key;
  },

  async storeSecureToken(token, sessionKey) {
    try {
      const iv = webcrypto.getRandomValues(new Uint8Array(12));
      const encodedToken = new TextEncoder().encode(token);
      
      const encrypted = await webcrypto.subtle.encrypt(
        { name: CRYPTO_CONFIG.name, iv },
        sessionKey,
        encodedToken
      );

      const securePayload = {
        iv: Array.from(iv),
        data: Array.from(new Uint8Array(encrypted)),
        expires: Date.now() + 3600000 // 1 hour
      };

      await SecureStorage.ephemeralSession.set(
        'authToken',
        JSON.stringify(securePayload)
      );
      
      // Wipe sensitive data from memory
      webcrypto.getRandomValues(new Uint8Array(encodedToken));
    } catch (error) {
      await this.handleSecurityError('STORAGE_FAILURE', error);
      throw new SecurityError('AUTH_SECURE_STORE_FAILED');
    }
  },

  async retrieveSecureToken(sessionKey) {
    try {
      const storedData = await SecureStorage.ephemeralSession.get('authToken');
      if (!storedData) return null;

      const { iv, data, expires } = JSON.parse(storedData);
      if (Date.now() > expires) {
        await this.clearSession();
        return null;
      }

      const decrypted = await webcrypto.subtle.decrypt(
        { name: CRYPTO_CONFIG.name, iv: new Uint8Array(iv) },
        sessionKey,
        new Uint8Array(data)
      );

      const token = new TextDecoder().decode(decrypted);
      
      // Create temporary buffer and wipe after use
      const tempBuffer = new Uint8Array(decrypted);
      const decodedToken = String.fromCharCode.apply(null, tempBuffer);
      webcrypto.getRandomValues(tempBuffer); // Overwrite buffer
      
      return decodedToken;
    } catch (error) {
      await this.clearSession();
      throw new SecurityError('AUTH_SECURE_RETRIEVE_FAILED');
    }
  },

  async clearSession() {
    await SecureStorage.ephemeralSession.clear();
    const sessionKey = await this.generateSessionKey();
    webcrypto.subtle.cryptoKey = null;
    window.sessionStorage.setItem('sessionActive', 'false');
  },

  async handleSecurityError(type, error) {
    const errorData = {
      type,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      message: error.message.slice(0, 50) + ' [REDACTED]'
    };
    await SecureStorage.logSecurityEvent(errorData);
  }
};

class SecurityError extends Error {
  constructor(message) {
    super(message);
    this.name = "SecurityError";
    this.stack = ''; // Remove stack trace in production
  }
}
