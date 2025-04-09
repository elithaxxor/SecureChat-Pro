import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const Security = {
  encryptPayload: (data, key) => {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([
      cipher.update(data, 'utf8'),
      cipher.final()
    ]);
    
    return {
      iv: iv.toString('hex'),
      content: encrypted.toString('hex'),
      tag: cipher.getAuthTag().toString('hex'),
      hmac: this.generateHMAC(data, key)
    };
  },

  decryptPayload: (encrypted, key) => {
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm', 
      key, 
      Buffer.from(encrypted.iv, 'hex')
    );
    decipher.setAuthTag(Buffer.from(encrypted.tag, 'hex'));
    
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encrypted.content, 'hex')),
      decipher.final()
    ]);
    
    this.verifyHMAC(decrypted.toString(), encrypted.hmac, key);
    return JSON.parse(decrypted.toString());
  },

  generateHMAC: (data, key) => {
    return crypto.createHmac('sha256', key)
      .update(data)
      .digest('hex');
  },

  verifyHMAC: (data, hmac, key) => {
    if (this.generateHMAC(data, key) !== hmac) {
      throw new Error('HMAC validation failed');
    }
  },

  rotateKeys: async () => {
    const newKey = crypto.randomBytes(32).toString('hex');
    await KeyVault.storeKey(newKey);
    return newKey;
  }
};
