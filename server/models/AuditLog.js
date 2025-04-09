// [Security Audit Model]

import mongoose from 'mongoose';
const AuditLogSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: ['AUTH', 'MESSAGE', 'CALL', 'SECURITY']
  },
  userHash: {
    type: String,
    required: true
  },
  ipHash: String,
  deviceHash: String,
  action: {
    type: String,
    required: true
  },
  outcome: {
    type: String,
    enum: ['SUCCESS', 'FAILURE']
  },
  metadata: {
    riskScore: Number,
    anomalyDetected: Boolean
  }
}, { timestamps: true });

// Retention policy index
AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 }); // 1 year

export default mongoose.model('AuditLog', AuditLogSchema);
