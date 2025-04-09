// client/src/contexts/SocketContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { Security } from '../lib/security';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { accessToken, sessionKey } = useAuth();
  const [socket, setSocket] = useState(null);

  const connectSocket = () => {
    if(!socket && accessToken) {
      const newSocket = io(process.env.VITE_WS_URL, {
        auth: {
          token: accessToken,
          sessionHash: Security.hashData(sessionKey)
        },
        transports: ['websocket'],
        upgrade: false
      });

      newSocket.on('reconnect_attempt', () => {
        newSocket.auth.token = accessToken;
      });

      setSocket(newSocket);
    }
  };

  const emitSecure = (event, payload) => {
    if(socket?.connected) {
      const encryptedPayload = Security.encryptPayload(
        JSON.stringify(payload),
        sessionKey
      );
      socket.emit(event, encryptedPayload);
    }
  };

  useEffect(() => {
    connectSocket();
    return () => {
      socket?.disconnect();
    };
  }, [accessToken]);

  return (
    <SocketContext.Provider value={{ socket, emitSecure }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
