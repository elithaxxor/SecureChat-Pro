import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import Chat from './components/Chat';
import VideoCall from './components/VideoCall';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [messages, setMessages] = useState(JSON.parse(localStorage.getItem('chat')) || []);
  const [message, setMessage] = useState('');
  const [stream, setStream] = useState(null);
  const [userStream, setUserStream] = useState(null);
  const connectionRef = useRef();

  useEffect(() => {
    socket.on('chat_message', (data) => {
      setMessages((prev) => {
        const updated = [...prev, data];
        localStorage.setItem('chat', JSON.stringify(updated));
        return updated;
      });
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(setStream)
      .catch((err) => console.error(err));

    socket.on('incoming_call', ({ from, signal }) => {
      const peer = new Peer({ initiator: false, trickle: false, stream });

      peer.on('signal', (signalData) => {
        socket.emit('answer_call', { signal: signalData, to: from });
      });

      peer.on('stream', setUserStream);
      peer.signal(signal);
      connectionRef.current = peer;
    });

    socket.on('call_answered', (signal) => {
      connectionRef.current.signal(signal);
    });
  }, [stream]);

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit('chat_message', { message, sender: socket.id, timestamp: new Date() });
    setMessage('');
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('call_user', { to: id, signal: data });
    });

    peer.on('stream', setUserStream);
    connectionRef.current = peer;
  };

  return (
    <div className="App">
      <h2>Real-Time React Chat & Video Call</h2>
      <Chat
        messages={messages}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        socketId={socket.id}
      />
      <VideoCall myStream={stream} userStream={userStream} />
      <div>Your ID: {socket.id}</div>
      {/* Add UI button/input to call a user by ID */}
    </div>
  );
}

export default App;
