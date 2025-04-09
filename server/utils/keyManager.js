import crypto from 'crypto';
import { SecurityConfig } from '../config/security';

export const KeyVault = {
  currentKey: null,
  keyHistory: [],

  init: () => {
    setInterval(this.rotateKeys, SecurityConfig.session.keyRotationInterval * 1000);
  },

  storeKey: (key) => {
    this.keyHistory.unshift({
      key: crypto.createHash('sha256').update(key).digest('hex'),
      timestamp: Date.now()
    });
    
    if(this.keyHistory.length > 5) this.keyHistory.pop();
    this.currentKey = key;
  },

  getCurrentKey: () => this.currentKey,

  getKeyByTime: (timestamp) => {
    return this.keyHistory.find(k => k.timestamp <= timestamp);
  }
};
