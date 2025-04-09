import { Security } from '../../lib/security';

export const encryptInterceptor = async (config) => {
  if(config.data) {
    config.data = Security.encryptPayload(config.data);
    config.headers['X-Encryption-Metadata'] = Security.getEncryptionMetadata();
  }
  
  if(config.params) {
    config.params = Security.signQueryParams(config.params);
  }
  
  return config;
};
