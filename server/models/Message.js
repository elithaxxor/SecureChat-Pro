import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  content: {
    ciphertext: {
      type: String,
      required: true
    },
    iv: {
      type: String,
      required: true
    },
    hmac: {
      type: String,
      required: true
    },
    encryptionVersion: {
      type: String,
      default: 'AES-256-GCM'
    }
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipients: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: Date,
    decryptionKey: {
      type: String,
      select: false
    }
  }],
  metadata: {
    deviceFingerprint: String,
    locationHash: String
  }
}, { timestamps: true });

// TTL index for automatic deletion
MessageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days

export default mongoose.model('Message', MessageSchema);
