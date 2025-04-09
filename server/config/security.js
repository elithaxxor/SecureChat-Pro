export default {
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 32,
    ivLength: 12,
    hmac: {
      algorithm: 'sha256',
      keyLength: 64
    }
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '15m',
    refreshExpiresIn: '7d'
  },
  session: {
    keyRotationInterval: 3600, // 1 hour
    maxConcurrentSessions: 3
  },
  passwordPolicy: {
    minLength: 12,
    requireSpecialChar: true,
    historySize: 5
  }
};
