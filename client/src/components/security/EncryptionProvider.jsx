import { useState, useMemo, useEffect } from 'react';
import { Security } from '../../lib/security';
import { useAuth } from '../../contexts/AuthContext';

export const EncryptionProvider = ({ children }) => {
  const { sessionKey } = useAuth();
  const [encryptionState, setEncryptionState] = useState('initializing');

  const crypto = useMemo(() => ({
    encrypt: (data) => Security.encryptData(data, sessionKey),
    decrypt: (ciphertext) => Security.decryptData(ciphertext, sessionKey),
    deriveKey: async (password) => {
      const { key, salt } = await Security.deriveKey(password);
      return { key, salt };
    }
  }), [sessionKey]);

  useEffect(() => {
    const init = async () => {
      await Security.loadWebCrypto();
      setEncryptionState('ready');
    };
    init();
  }, []);

  if (encryptionState !== 'ready') return <div className="security-badge">🔒 Initializing Secure Module...</div>;

  return (
    <EncryptionContext.Provider value={crypto}>
      {children}
      <div className="security-badge">🔐 Session Encrypted</div>
    </EncryptionContext.Provider>
  );
};
