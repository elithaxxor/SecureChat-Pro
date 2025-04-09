// [Secure WebRTC Configuration] || client/src/lib/webrtc.js
export const WebRTCConfig = {
  getIceServers: () => {
    return process.env.VITE_ICE_SERVERS.split(',').map(server => {
      const [protocol, config] = server.split('://');
      return {
        urls: `${protocol}://${config}`,
        username: process.env.VITE_TURN_USERNAME,
        credential: process.env.VITE_TURN_CREDENTIAL
      };
    });
  },

  createSecurePeer: (options) => {
    return new SimplePeer({
      ...options,
      config: { 
        iceServers: this.getIceServers(),
        sdpSemantics: 'unified-plan'
      },
      offerConstraints: {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      }
    });
  },

  generateFingerprint: (certificate) => {
    const hash = CryptoJS.SHA256(certificate).toString();
    return hash.match(/.{1,2}/g).join(':').toUpperCase();
  }
};
