// WebRTC Session Model (models/WebRTCSession.js)


import mongoose from 'mongoose';

const WebRTCSchema = new mongoose.Schema({
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  offer: {
    type: String,
    required: true,
    select: false
  },
  answer: {
    type: String,
    select: false
  },
  iceCandidates: [{
    candidate: {
      type: String,
      select: false
    },
    sdpMid: String,
    sdpMLineIndex: Number
  }],
  security: {
    fingerprint: String,
    dtlsParameters: {
      type: String,
      select: false
    }
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'terminated'],
    default: 'pending'
  }
}, { timestamps: true });

// Compound index for faster session lookup
WebRTCSchema.index({ initiator: 1, recipient: 1, status: 1 });

export default mongoose.model('WebRTCSession', WebRTCSchema);
