//  [Secure Session Management] --> client/src/hooks/useSession.js
import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { useAuth } from '../stores/authStore';

export const useSession = () => {
  const { user } = useAuth();
  const [sessionData, setSessionData] = useState(null);

  const encryptSession = (data) => {
    const ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      process.env.VITE_SESSION_SECRET
    ).toString();
    
    localStorage.setItem('session', ciphertext);
  };

  const decryptSession = () => {
    const ciphertext = localStorage.getItem('session');
    if(!ciphertext) return null;
    
    const bytes = CryptoJS.AES.decrypt(
      ciphertext, 
      process.env.VITE_SESSION_SECRET
    );
    
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  };

  const rotateSessionKey = () => {
    const newKey = CryptoJS.lib.WordArray.random(256/8).toString();
    localStorage.setItem('sessionKey', newKey);
    return newKey;
  };

  useEffect(() => {
    if(user) {
      const existingSession = decryptSession();
      if(!existingSession || existingSession.userId !== user.id) {
        const newSession = {
          userId: user.id,
          key: rotateSessionKey(),
          expires: Date.now() + 3600000 // 1 hour
        };
        encryptSession(newSession);
        setSessionData(newSession);
      }
    }
  }, [user]);

  return { sessionData, rotateSessionKey };
};
