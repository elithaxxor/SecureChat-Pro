// client/src/lib/security.js
import CryptoJS from 'crypto-js';

const SECURE_STORAGE_KEY = 'chat_sess';

export const SessionManager = {
  createSession: (userData, token) => {
    const sessionKey = CryptoJS.lib.WordArray.random(256/8).toString();
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify({
        user: userData,
        token,
        expires: Date.now() + 3600 * 1000 // 1 hour
      }),
      sessionKey
    ).toString();
    
    localStorage.setItem(SECURE_STORAGE_KEY, encryptedData);
    return sessionKey;
  },

  getSession: (sessionKey) => {
    const encryptedData = localStorage.getItem(SECURE_STORAGE_KEY);
    if(!encryptedData) return null;
    
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, sessionKey);
      const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      if(data.expires < Date.now()) throw new Error('Session expired');
      return data;
    } catch (error) {
      this.clearSession();
      return null;
    }
  },

  clearSession: () => {
    localStorage.removeItem(SECURE_STORAGE_KEY);
  }
};
