import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Security } from '../lib/security';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    validate: {
      validator: v => /^[a-zA-Z0-9_\-]{4,20}$/.test(v),
      message: 'Invalid username format'
    }
  },
  security: {
    derivedKey: {
      type: String,
      required: true,
      select: false
    },
    salt: {
      type: String,
      required: true,
      select: false
    },
    iterations: {
      type: Number,
      default: 100000
    },
    lastRotated: Date
  },
  sessions: [{
    token: {
      type: String,
      required: true,
      select: false
    },
    ipHash: String,
    userAgentHash: String,
    expires: Date
  }],
  securityFlags: {
    mfaEnabled: Boolean,
    lastFailedAttempt: Date,
    lockUntil: Date
  }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if(this.isModified('security')) {
    this.security.lastRotated = Date.now();
  }
  
  if(this.isModified('password')) {
    const salt = Security.generateSalt();
    this.security = {
      derivedKey: await bcrypt.hash(this.password, salt),
      salt,
      iterations: Security.PBKDF2_ITERATIONS
    };
  }
  next();
});

export default mongoose.model('User', UserSchema);
