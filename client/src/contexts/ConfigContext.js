// --> [Security Configuration] || client/src/contexts/ConfigContext.js

import { createContext, useContext, useState, useEffect } from 'react';
import { Security } from '../lib/security';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [securityConfig, setSecurityConfig] = useState({
    encryptionVersion: 'AES-256-GCM',
    keyRotationInterval: 3600 // 1 hour
  });

  const rotateKeys = async () => {
    const newConfig = await Security.rotateMasterKey();
    setSecurityConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  };

  const getCryptoConfig = () => {
    return {
      ivSize: Security.IV_LENGTH,
      keyDerivation: Security.PBKDF2_CONFIG,
      hmacAlgorithm: 'SHA256'
    };
  };

  useEffect(() => {
    const interval = setInterval(rotateKeys, securityConfig.keyRotationInterval * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ConfigContext.Provider value={{ 
      securityConfig,
      getCryptoConfig,
      rotateKeys 
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
