// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Socket.io events
io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('chat_message', (data) => {
    io.emit('chat_message', data); // broadcast message
  });

  // WebRTC signaling
  socket.on('call_user', (data) => {
    io.to(data.to).emit('incoming_call', { from: socket.id, signal: data.signal });
  });

  socket.on('answer_call', (data) => {
    io.to(data.to).emit('call_answered', data.signal);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log('Server is running on port', process.env.PORT || 5000);
});
