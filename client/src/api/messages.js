import api from './index';
import { Security } from '../lib/security';

export const MessageAPI = {
  send: (encryptedMessage) => {
    const signedMessage = Security.signPayload({
      content: encryptedMessage,
      timestamp: Date.now()
    });
    
    return api.post('/messages', signedMessage);
  },

  getConversation: (chatId) => api.get(`/messages/${chatId}`, {
    params: {
      sig: Security.createQuerySignature({ chatId })
    }
  }),

  delete: (messageId) => api.delete(`/messages/${messageId}`, {
    headers: {
      'X-Delete-Verification': Security.generateDeletionProof(messageId)
    }
  })
};
