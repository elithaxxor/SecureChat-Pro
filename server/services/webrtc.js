/* server/services/webrtc.js

WebRTC Signaling Server
*/

import { Server } from 'socket.io';

const configureWebRTC = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"]
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000 // 2 minutes
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if(err) return next(new Error('Authentication error'));
      socket.user = decoded;
      next();
    });
  });

  io.on('connection', (socket) => {
    socket.join(socket.user.id);

    socket.on('signal', ({ target, signal }) => {
      socket.to(target).emit('signal', {
        from: socket.user.id,
        signal,
        timestamp: Date.now()
      });
    });

    socket.on('disconnect', () => {
      io.to(socket.user.id).emit('peer-disconnected');
    });
  });
};

export default configureWebRTC;
