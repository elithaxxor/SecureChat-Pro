// --> [Secure Session Handling] || client/src/lib/sessionManager.js
import CryptoJS from 'crypto-js';
import { Security } from './security';

export const SessionManager = {
  createSession: (userData, token) => {
    const sessionKey = Security.generateSessionKey();
    const encryptedData = Security.encrypt(
      JSON.stringify({
        user: userData,
        token: token,
        expires: Date.now() + 3600000 // 1 hour
      }),
      process.env.VITE_SESSION_SECRET
    );

    localStorage.setItem('sessionKey', sessionKey);
    localStorage.setItem('sessionData', JSON.stringify(encryptedData));
    return sessionKey;
  },

  getSession: (sessionKey) => {
    const encryptedData = JSON.parse(localStorage.getItem('sessionData'));
    if(!encryptedData) return null;

    try {
      const decrypted = Security.decrypt(encryptedData, process.env.VITE_SESSION_SECRET);
      const data = JSON.parse(decrypted);
      
      if(data.expires < Date.now()) {
        this.clearSession();
        return null;
      }
      
      return data;
    } catch (error) {
      this.clearSession();
      return null;
    }
  },

  clearSession: () => {
    localStorage.removeItem('sessionKey');
    localStorage.removeItem('sessionData');
    window.location.reload();
  },

  rotateKeys: () => {
    const newSecret = Security.generateSessionKey();
    const existingSession = this.getSession();
    
    if(existingSession) {
      this.createSession(existingSession.user, existingSession.token);
    }
    
    return newSecret;
  }
};
