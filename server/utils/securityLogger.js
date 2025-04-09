import { Security } from './cryptoEngine';

export const ErrorHandler = {
  logSecurityEvent: (event) => {
    const logEntry = {
      timestamp: Date.now(),
      event: Security.hashData(event.type),
      user: event.user ? Security.hashData(event.user) : 'system',
      ipHash: Security.hashData(event.ip),
      metadata: Security.encryptPayload(event.metadata)
    };

    process.env.NODE_ENV === 'production'
      ? writeToSecureStore(logEntry)
      : console.log('[SECURITY]', logEntry);
  },

  handleCryptoError: (error) => {
    this.logSecurityEvent({
      type: 'CRYPTO_FAILURE',
      metadata: error.message
    });
    process.exit(1);
  }
};
