// --> [Core Cryptography] || client/src/lib/security.js
import CryptoJS from 'crypto-js';

export const Security = {
  // AES-256-CBC Encryption with HMAC
  encrypt: (plaintext, key) => {
    const iv = CryptoJS.lib.WordArray.random(128/8);
    const cipher = CryptoJS.AES.encrypt(plaintext, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    const hmac = CryptoJS.HmacSHA256(cipher.toString(), key);
    return {
      iv: iv.toString(),
      ciphertext: cipher.toString(),
      hmac: hmac.toString()
    };
  },

  decrypt: (encrypted, key) => {
    const hmac = CryptoJS.HmacSHA256(encrypted.ciphertext, key);
    if(hmac.toString() !== encrypted.hmac) {
      throw new Error('HMAC validation failed');
    }
    
    const decipher = CryptoJS.AES.decrypt(encrypted.ciphertext, key, {
      iv: CryptoJS.enc.Hex.parse(encrypted.iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    return decipher.toString(CryptoJS.enc.Utf8);
  },

  deriveKey: (password, salt) => {
    return CryptoJS.PBKDF2(password, salt, {
      keySize: 256/32,
      iterations: 100000,
      hasher: CryptoJS.algo.SHA512
    });
  },

  generateSessionKey: () => {
    return CryptoJS.lib.WordArray.random(256/8).toString();
  },

  hashData: (data) => {
    return CryptoJS.SHA3(data, { outputLength: 512 }).toString();
  }
};
