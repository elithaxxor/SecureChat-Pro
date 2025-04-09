// --> [errror handler] || client/src/lib/errorHandler.js
import { Security } from './security';

export const ErrorHandler = {
  secureError: (error) => {
    const errorId = Security.hashData(Date.now().toString());
    
    // Sanitize error message
    const safeMessage = error.message
      .replace(/credentials/i, '[REDACTED]')
      .replace(/token/i, '[REDACTED]')
      .replace(/at .*:\d+:\d+/gi, '[STACK TRACE REDACTED]');
      
    return {
      id: errorId,
      message: safeMessage,
      timestamp: Date.now(),
      code: error.code || 500
    };
  },

  handleCryptoError: (error) => {
    console.error('[CRYPTO FAILURE]', Security.hashData(error.message));
    SessionManager.clearSession();
    window.location.reload();
  },

  logSecure: (message) => {
    const encryptedLog = Security.encrypt(message, process.env.VITE_LOG_SECRET);
    console.log('[SECURE LOG]', encryptedLog.ciphertext);
  }
};
