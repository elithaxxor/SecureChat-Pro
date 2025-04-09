import api from './index';
import { Security } from '../lib/security';

export const WebRTCAPI = {
  initiateCall: (targetUserId) => {
    const encryptedOffer = Security.encryptForTarget(
      Security.generateCallToken(),
      targetUserId
    );
    
    return api.post('/webrtc/initiate', encryptedOffer);
  },

  sendSignal: (signalData) => api.put('/webrtc/signal', {
    data: Security.encryptPayload(signalData),
    headers: {
      'X-Signal-Type': Security.hashData(signalData.type)
    }
  }),

  endCall: (callId) => api.delete(`/webrtc/calls/${callId}`, {
    headers: {
      'X-Termination-Proof': Security.generateTerminationProof(callId)
    }
  })
};
