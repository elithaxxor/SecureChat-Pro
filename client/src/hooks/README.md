
1. create .env
eg:

# Server
JWT_SECRET=your_256bit_secret
MONGO_URI=mongodb://localhost:27017/securechat
ICE_SERVERS=stun:stun.l.google.com:19302

# Client
VITE_API_URL=http://localhost:5000
VITE_ICE_SERVERS=stun:stun.l.google.com:19302

2.install dependencies
npm install jsonwebtoken socket.io simple-peer crypto-js mongoose bcryptjs

## Change log
Added Security Features:

End-to-End Encryption
AES-256-CBC with HMAC-SHA256 message authentication
Client-side key derivation (PBKDF2 with 10k iterations)
Unique IV per message
Secure Session Management
Encrypted localStorage session storage
Automatic session key rotation
HMAC message signing for WebSocket events
Media Security
WebRTC with forced encryption
STUN/TURN server authentication
Media stream cleanup on disconnect
Network Protection
WebSocket transport encryption
Connection timeout handling
Automatic reauthentication
Error Handling
Graceful crypto operation failures
Secure error logging
Automatic session invalidation
