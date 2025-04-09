import { Security } from '../../lib/security';
import { ErrorHandler } from '../../lib/errorHandler';

export const errorInterceptor = async (error) => {
  const response = error.response;
  
  if(response) {
    // Decrypt error payload
    const errorData = Security.decryptPayload(response.data);
    
    // Handle session invalidation
    if(errorData.code === 'SESSION_INVALID') {
      Security.clearSession();
      window.location.reload();
    }
    
    throw ErrorHandler.secureError({
      ...errorData,
      status: response.status
    });
  }
  
  throw ErrorHandler.secureError({
    code: 'NETWORK_ERROR',
    message: 'Secure connection failed'
  });
};
