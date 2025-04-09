// --> [Cryptography Hook] client/src/hooks/useEncryption.js
import { useState, useEffect, useCallback } from 'react';
import CryptoJS from 'crypto-js';
import { useAuth } from '../stores/authStore';

export const useEncryption = () => {
  const { sessionKey } = useAuth();
  const [derivedKey, setDerivedKey] = useState(null);

  // Key derivation with PBKDF2
  const deriveSessionKey = useCallback((password, salt) => {
    return CryptoJS.PBKDF2(password, salt, {
      keySize: 256/32,
      iterations: 10000,
      hasher: CryptoJS.algo.SHA256
    });
  }, []);

  // Initialize encryption parameters
  useEffect(() => {
    if(sessionKey) {
      const key = CryptoJS.enc.Utf8.parse(sessionKey);
      setDerivedKey(key);
    }
  }, [sessionKey]);

  const generateIV = () => {
    return CryptoJS.lib.WordArray.random(128/8).toString();
  };

  const encryptData = (plaintext, iv) => {
    if(!derivedKey) throw new Error('Encryption key not available');
    
    return CryptoJS.AES.encrypt(
      plaintext, 
      derivedKey, 
      { iv: CryptoJS.enc.Hex.parse(iv) }
    ).toString();
  };

  const decryptData = (ciphertext, iv) => {
    if(!derivedKey) throw new Error('Decryption key not available');
    
    return CryptoJS.AES.decrypt(
      ciphertext,
      derivedKey,
      { iv: CryptoJS.enc.Hex.parse(iv) }
    ).toString(CryptoJS.enc.Utf8);
  };

  return { deriveSessionKey, generateIV, encryptData, decryptData };
};
