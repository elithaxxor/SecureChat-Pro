const express = require('express');
const helmet = require('helmet');
const { requestDecryptor } = require('./middleware/security/request-decrypt');
const { responseEncryptor } = require('./middleware/security/response-encrypt');
const securityHeaders = require('./middleware/security/headers');
const rateLimiter = require('./middleware/security/rate-limiter');

const app = express();

// ========================
// Security Middleware Chain
// ========================

// 1. Security Headers First
app.use(securityHeaders());

// 2. Rate Limiting
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per window
}));

// 3. Body Parsing for Encrypted Payloads
app.use(express.raw({
  type: 'application/json',
  limit: '5mb' // Prevent memory exhaustion attacks
}));

// 4. Request Decryption
app.use(requestDecryptor);

// 5. JSON Parsing of Decrypted Data
app.use(express.json());

// 6. Response Encryption
app.use(responseEncryptor);

// 7. Security Headers Enforcement
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      scriptSrc: ["'self'", "'sha256-...'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"]
    }
  },
  hsts: {
    maxAge: 63072000, // 2 years in seconds
    includeSubDomains: true,
    preload: true
  }
}));

// ========================
// Application Routes
// ========================
const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');

app.use('/api/v1', apiRouter);
app.use('/auth', authRouter);

// ========================
// Security Error Handling
// ========================
app.use((err, req, res, next) => {
  if (err.name === 'SecurityError') {
    res.status(403).json({
      error: 'security_violation',
      message: 'Request blocked by security policy',
      code: err.message
    });
  } else {
    res.status(500).json({
      error: 'internal_error',
      message: 'An unexpected error occurred'
    });
  }
});

// ========================
// Server Initialization
// ========================
const PORT = process.env.SECURE_PORT || 3443;
const server = app.listen(PORT, () => {
  console.log(`🔒 Secure server running in ${process.env.NODE_ENV} mode`);
  console.log(`🚀 Listening on port ${PORT} with TLS 1.3 only`);
});

// ========================
// Security Event Listeners
// ========================
server.on('tlsClientError', (err) => {
  console.error(`🚨 TLS Handshake Failed: ${err.message}`);
});

process.on('uncaughtException', (err) => {
  console.error(`🚨 Critical Security Event: ${err.message}`);
  process.exit(1);
});

module.exports = server;
