import { SecurityContext } from './SecurityContext';
import { useSecureCrypto } from '../hooks/useSecureCrypto';

export const SecurityProvider = ({ children }) => {
  const { encrypt, decrypt } = useSecureCrypto();

  return (
    <SecurityContext.Provider value={{ encrypt, decrypt }}>
      <SecureBoundary level="high">
        {children}
      </SecureBoundary>
    </SecurityContext.Provider>
  );
};
