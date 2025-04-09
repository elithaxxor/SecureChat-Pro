import { useCallback } from 'react';
import { Security } from '../../lib/security';
import { useEncryption } from '../../hooks/useEncryption';

export const SecureUpload = () => {
  const { encrypt } = useEncryption();
  
  const handleSecureUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const encryptedFile = await Security.encryptFile(file);
      const signedPayload = Security.signPayload({
        name: Security.hashFilename(file.name),
        data: encryptedFile,
        mimeType: Security.encryptData(file.type)
      });

      await Security.uploadToSecureStorage(signedPayload);
    } catch (error) {
      Security.clearFileInput(e.target);
    }
  }, [encrypt]);

  return (
    <div className="secure-upload-container">
      <input
        type="file"
        onChange={handleSecureUpload}
        className="encrypted-file-input"
        data-max-size="100MB"
      />
      <div className="security-note">
        🔒 Files encrypted with AES-256 before upload
      </div>
    </div>
  );
};
