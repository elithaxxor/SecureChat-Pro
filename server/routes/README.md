# Key Features:

```markdown
Security First
JWT authentication on all endpoints
Rate-limited authentication endpoints
Session management with refresh tokens
Participant validation for messages
E2EE Support
Encrypted message storage
IV (Initialization Vector) handling
Session-based encryption keys
Real-Time Ready
ICE server configuration endpoint
Connection health monitoring
Message metadata for delivery tracking
Scalability
Paginated message retrieval
Lean query results for performance
Indexed database queries
Validation
Input sanitization
Participant verification
Error handling middleware
To use these routes:

Create a routes directory in your server
Add these files with proper imports
Mount them in your main server file:


```bash
// server/index.js
app.use('/auth', require('./routes/auth'));
app.use('/messages', require('./routes/messages'));
app.use('/webrtc', require('./routes/webrtc'));
```

changelog v2

```
## Changelog: 
Key Security Features:
```markdown
End-to-End Encryption
Session-key encrypted payloads
Per-message HMAC validation
Forward-secure key exchange
Authentication
Double-encrypted JWT tokens
Session binding to client fingerprints
Strict ownership verification
Data Integrity
Cryptographic hash IDs
Signal message validation
Secure shredding of deleted data
Privacy Compliance
GDPR right-to-erasure implementation
Encrypted data exports
Pseudonymous identifiers
Attack Prevention
Parameter validation
Ownership checks
Timing attack protection
Secure Signaling
DTLS fingerprint verification
Encrypted ICE candidates
Session state validation

