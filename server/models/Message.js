/* server/models/Message.js

Model for db 

*/ 

import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  sessionId: {
    type: String,
    index: true,
    required: true
  },
  encryptedContent: {
    type: String,
    required: true
  },
  iv: {
    type: String,
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  metadata: {
    sentAt: {
      type: Date,
      default: Date.now
    },
    deliveredAt: Date,
    readAt: Date
  }
}, {
  timestamps: true,
  autoIndex: process.env.NODE_ENV === 'development'
});

schema.index({ 
  participants: 1, 
  'metadata.sentAt': -1 
});

export default mongoose.model('Message', schema);
