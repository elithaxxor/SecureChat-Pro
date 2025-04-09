Initialize React frontend:

```bash
  cd ../
  npx create-react-app client
  cd client
  npm install socket.io-client simple-peer
```
To set up the project:

Install dependencies separately
```bash
  # Client
  cd client && npm ci --omit=dev
  
  # Server
  cd server && npm ci --omit=dev
```

Delploy: 
```bash
  # Client
  npm run build && serve -s dist -l 3000
  
  # Server
  NODE_ENV=production npm start
```

# 📌 Quick Explanation

```markdown 
## Server Dependencies
- **express**: Backend framework.
- **cors**: Enables Cross-Origin Resource Sharing.
- **dotenv**: Loads environment variables from `.env`.
- **mongoose**: MongoDB ORM for Node.js.
- **socket.io**: Real-time communication using WebSockets.
- **nodemon** (devDependency): Automatically restarts server during development.

## Client Dependencies
- **react**, **react-dom**, **react-scripts**: Core React dependencies.
- **socket.io-client**: Client-side library for WebSocket communication.
- **simple-peer**: Simplified WebRTC implementation allowing peer-to-peer video connections.
```
Key Features:

```markdown
Security-First Dependencies
Client: CryptoJS for encryption, React Router for protected routes
Server: Helmet, rate-limiting, JWT, and bcrypt
Modern ES Modules Support
"type": "module" for both configurations
Latest versions of all packages
Optimized Production Builds
Vite for client-side optimizations
Compression middleware for server
Developer Experience
Linting configurations
Hot-reload support (Vite/Nodemon)
Testing setup (Jest/Supertest)
Runtime Requirements
Node.js 20+ for modern features
npm 9+ for workspace support
```
