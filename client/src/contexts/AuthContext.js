// [Authentication & Session Managemen] client/src/contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { SessionManager, Security } from '../lib/security';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [sessionKey, setSessionKey] = useState(null);

  const initializeSession = async () => {
    const sessionData = SessionManager.getSession();
    if(sessionData) {
      try {
        const { user, token } = Security.decryptSession(sessionData);
        api.setAuthHeader(token);
        setUser(user);
        setAccessToken(token);
        setSessionKey(sessionData.key);
      } catch (error) {
        SessionManager.clearSession();
      }
    }
  };

  const login = async (credentials) => {
    const { username, password } = credentials;
    const salt = Security.generateSalt();
    const derivedKey = Security.deriveKey(password, salt);
    
    const { data } = await api.post('/auth/login', {
      username,
      clientKey: Security.hashData(derivedKey)
    });

    const session = SessionManager.createSession({
      user: data.user,
      token: data.accessToken,
      refreshToken: data.refreshToken
    }, derivedKey);

    setUser(data.user);
    setAccessToken(data.accessToken);
    setSessionKey(session.key);
  };

  const logout = () => {
    SessionManager.clearSession();
    api.clearAuthHeader();
    setUser(null);
    setAccessToken(null);
    setSessionKey(null);
  };

  const refreshToken = async () => {
    try {
      const { data } = await api.post('/auth/refresh', {
        refreshToken: user.refreshToken
      });
      api.setAuthHeader(data.accessToken);
      setAccessToken(data.accessToken);
    } catch (error) {
      logout();
    }
  };

  useEffect(() => {
    initializeSession();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user,
      accessToken,
      sessionKey,
      login,
      logout,
      refreshToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
