// Security Audit Model 

import mongoose from 'mongoose';

const SecurityConfigSchema = new mongoose.Schema({
  encryptionParameters: {
    algorithm: {
      type: String,
      default: 'aes-256-gcm'
    },
    keyRotationInterval: {
      type: Number,
      default: 3600 // 1 hour
    }
  },
  passwordPolicy: {
    minLength: {
      type: Number,
      default: 12
    },
    requireSpecialChar: Boolean,
    historySize: {
      type: Number,
      default: 5
    }
  },
  sessionConfig: {
    idleTimeout: Number,
    absoluteTimeout: Number
  },
  compliance: {
    gdprRetention: Number,
    hipaaCompliant: Boolean
  }
});

export default mongoose.model('SecurityConfig', SecurityConfigSchema);
