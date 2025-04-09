Frontend Setup (React + Socket.io-client + Simple-peer for WebRTC):

Step A: Initialize React frontend:
```bash
  cd../
  npx create-react-app client
  cd client
  npm install socket.io-client simple-peer
```

📌 Quick Explanation:

Server Dependencies:
express: Backend framework.
cors: Enables Cross-Origin Resource Sharing.
dotenv: Loads environment variables from .env.
mongoose: MongoDB ORM for Node.js.
socket.io: Real-time communication using WebSockets.
nodemon (devDependency): Automatically restarts server during development.
Client Dependencies:
react, react-dom, react-scripts: Core React dependencies.
socket.io-client: Client-side library for WebSocket communication.
simple-peer: Simplified WebRTC implementation allowing peer-to-peer video connections.

