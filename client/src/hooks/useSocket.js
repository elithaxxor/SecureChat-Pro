// [Secure WebSocket Hook] || client/src/hooks/useSocket.js

import { useEffect, useRef } from 'react';
import { useAuth } from '../stores/authStore';
import io from 'socket.io-client';

export const useSocket = (namespace = '/secure') => {
  const { sessionKey } = useAuth();
  const socketRef = useRef();

  const connectSocket = () => {
    if(!socketRef.current && sessionKey) {
      socketRef.current = io(process.env.VITE_API_URL + namespace, {
        auth: { token: sessionKey },
        transports: ['websocket'],
        upgrade: false,
        reconnectionAttempts: 3,
        timeout: 5000
      });

      socketRef.current.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
      });
    }
  };

  useEffect(() => {
    connectSocket();
    return () => {
      socketRef.current?.disconnect();
    };
  }, [sessionKey]);

  const emitSecure = (event, data) => {
    if(socketRef.current?.connected) {
      socketRef.current.emit(event, {
        ...data,
        timestamp: Date.now(),
        signature: generateMessageSignature(data)
      });
    }
  };

  const generateMessageSignature = (data) => {
    return CryptoJS.HmacSHA256(
      JSON.stringify(data), 
      sessionKey
    ).toString();
  };

  return { socket: socketRef.current, emitSecure };
};
