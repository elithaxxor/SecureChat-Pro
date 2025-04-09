// [ Base API Configuration (api/index.js)] 
import axios from 'axios';
import { Security } from '../lib/security';
import { authInterceptor } from './interceptors/auth';
import { encryptInterceptor } from './interceptors/encrypt';
import { errorInterceptor } from './interceptors/error';

const api = axios.create({
  baseURL: process.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/octet-stream' // Encrypted payloads
  }
});

// Request processing chain
api.interceptors.request.use(encryptInterceptor);
api.interceptors.request.use(authInterceptor);

// Response processing chain
api.interceptors.response.use(
  response => ({
    ...response,
    data: Security.decryptPayload(response.data)
  }),
  errorInterceptor
);

export default api;
