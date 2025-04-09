// --> [Security Compliance] || client/src/lib/validation.js

import { Security } from './security';

export const Validation = {
  sanitizeInput: (input) => {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  validateJWT: (token) => {
    try {
      const [header, payload, signature] = token.split('.');
      const calculatedSig = Security.hashData(`${header}.${payload}`);
      
      return calculatedSig === Security.hashData(signature);
    } catch (error) {
      return false;
    }
  },

  schemaCheck: (data, schema) => {
    return Object.entries(schema).every(([key, type]) => {
      if(!(key in data)) return false;
      return typeof data[key] === type;
    });
  },

  rateLimitCheck: (timestamps, windowMs = 60000, max = 100) => {
    const now = Date.now();
    const recent = timestamps.filter(ts => now - ts < windowMs);
    return recent.length < max;
  }
};
