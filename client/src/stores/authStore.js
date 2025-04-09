// client/src/stores/authStore.js
import { createContext, useContext, useEffect, useState } from 'react';
import { SessionManager } from '../lib/security';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sessionKey, setSessionKey] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session from encrypted storage
  useEffect(() => {
    const initializeSession = async () => {
      const storedKey = localStorage.getItem('session_key');
      if(storedKey) {
        const sessionData = SessionManager.getSession(storedKey);
        if(sessionData) {
          setUser(sessionData.user);
          setSessionKey(storedKey);
          api.setAuthHeader(sessionData.token);
        }
      }
      setLoading(false);
    };
    initializeSession();
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    const newSessionKey = SessionManager.createSession(
      data.user, 
      data.accessToken
    );
    
    localStorage.setItem('session_key', newSessionKey);
    api.setAuthHeader(data.accessToken);
    setUser(data.user);
    setSessionKey(newSessionKey);
  };

  const logout = () => {
    SessionManager.clearSession();
    localStorage.removeItem('session_key');
    api.clearAuthHeader();
    setUser(null);
    setSessionKey(null);
  };

  const refreshToken = async () => {
    try {
      const { data } = await api.post('/auth/refresh', {
        refreshToken: user.refreshToken
      });
      api.setAuthHeader(data.accessToken);
    } catch (error) {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      sessionKey,
      loading,
      login,
      logout,
      refreshToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
