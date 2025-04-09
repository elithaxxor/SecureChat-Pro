export const CRYPTO_CONFIG = {
  algorithms: {
    encrypt: {
      name: "AES-GCM",
      length: 256,
      tagLength: 128
    },
    deriveKey: {
      name: "PBKDF2",
      iterations: 100000,
      hash: "SHA-256"
    }
  },
  keyUsages: [
    "encrypt", 
    "decrypt", 
    "wrapKey", 
    "unwrapKey"
  ]
};

export const MEDIA_SECURITY = {
  webrtc: {
    iceServers: [
      {
        urls: "stun:global.stun.twilio.com:3478",
        credential: "Z3JhZGllbnQtc2VjdXJl",
        username: "3b46352e3139343832383331"
      }
    ],
    iceTransportPolicy: "relay",
    bundlePolicy: "max-bundle",
    certificates: [
      {
        algorithm: "ECDSA",
        namedCurve: "P-256"
      }
    ]
  }
};
