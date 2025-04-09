import { useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Security } from '../../lib/security';

export const SecureLoginForm = () => {
  const { login } = useAuth();
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSecureSubmit = async (e) => {
    e.preventDefault();
    
    const credentials = {
      username: Security.sanitizeInput(usernameRef.current.value),
      password: Security.hashPassword(passwordRef.current.value)
    };

    const encryptedPayload = Security.encryptCredentials(
      credentials,
      Security.getEphemeralKey()
    );

    try {
      await login({
        encrypted: encryptedPayload,
        publicKey: Security.getPublicKey()
      });
    } catch (error) {
      Security.clearSensitiveFields([
        usernameRef.current,
        passwordRef.current
      ]);
    }
  };

  return (
    <form onSubmit={handleSecureSubmit} className="secure-form">
      <SecureInput
        ref={usernameRef}
        type="text"
        label="Username"
        validation={Security.validateUsername}
      />
      <SecureInput
        ref={passwordRef}
        type="password"
        label="Password"
        validation={Security.validatePassword}
      />
      <button type="submit" className="encrypted-submit">
        🔒 Secure Login
      </button>
    </form>
  );
};
