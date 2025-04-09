// [Authentication Service]
import api from './index';
import { Security } from '../lib/security';

export const AuthAPI = {
  login: (credentials) => {
    const encryptedCredentials = Security.encryptPayload({
      ...credentials,
      clientNonce: Security.generateNonce()
    });
    
    return api.post('/auth', encryptedCredentials, {
      headers: {
        'X-Client-Version': Security.hashData(process.env.VITE_APP_VERSION)
      }
    });
  },

  refreshToken: (refreshToken) => {
    const encryptedToken = Security.encryptPayload(refreshToken, 'refresh');
    return api.post('/auth/refresh', encryptedToken);
  },

  logout: () => api.delete('/auth', {
    headers: {
      'X-Session-Signature': Security.createRequestSignature()
    }
  })
};
