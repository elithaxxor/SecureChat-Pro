import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [messages, setMessages] = useState(JSON.parse(localStorage.getItem('chat')) || []);
  const [message, setMessage] = useState('');
  const [stream, setStream] = useState(null);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    socket.on('chat_message', (data) => {
      setMessages(prev => {
        const updated = [...prev, data];
        localStorage.setItem('chat', JSON.stringify(updated));
        return updated;
      });
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(currentStream => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      });

    socket.on('incoming_call', ({ from, signal }) => {
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream
      });

      peer.on('signal', signalData => {
        socket.emit('answer_call', { signal: signalData, to: from });
      });

      peer.on('stream', remoteStream => {
        userVideo.current.srcObject = remoteStream;
      });

      peer.signal(signal);
      connectionRef.current = peer;
    });

    socket.on('call_answered', (signal) => {
      connectionRef.current.signal(signal);
    });
  }, [stream]);

  const sendMessage = () => {
    const data = { message, sender: socket.id, timestamp: new Date() };
    socket.emit('chat_message', data);
    setMessage('');
  };

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    });

    peer.on('signal', data => {
      socket.emit('call_user', { to: id, signal: data });
    });

    peer.on('stream', remoteStream => {
      userVideo.current.srcObject = remoteStream;
    });

    connectionRef.current = peer;
  };

  return (
    <div className="App">
      <h2>React Chat & Video Call</h2>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i}>
              <strong>{msg.sender === socket.id ? 'You' : msg.sender}:</strong> {msg.message}
            </div>
          ))}
        </div>

        <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a message" />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div className="video-container">
        <video ref={myVideo} autoPlay muted style={{ width: "200px" }} />
        <video ref={userVideo} autoPlay style={{ width: "200px" }} />
      </div>
    </div>
  );
}

export default App;
