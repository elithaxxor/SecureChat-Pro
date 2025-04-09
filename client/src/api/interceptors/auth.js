import { Security } from '../../lib/security';
import { useAuthStore } from '../../stores/authStore';

export const authInterceptor = async (config) => {
  const { accessToken, sessionKey } = useAuthStore.getState();
  
  if(accessToken) {
    config.headers.Authorization = `Bearer ${Security.encryptToken(accessToken, sessionKey)}`;
    config.headers['X-Session-Signature'] = Security.createSessionSignature();
  }
  
  return config;
};
