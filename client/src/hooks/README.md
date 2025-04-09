
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
