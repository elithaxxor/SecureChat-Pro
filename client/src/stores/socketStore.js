// client/src/stores/socketStore.js
import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './authStore';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, sessionKey } = useAuth();

  useEffect(() => {
    if(user && sessionKey) {
      const newSocket = io(process.env.VITE_API_URL, {
        auth: {
          token: sessionKey
        },
        transports: ['websocket'],
        upgrade: false
      });

      setSocket(newSocket);

      return () => newSocket.disconnect();
    }
  }, [user, sessionKey]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
