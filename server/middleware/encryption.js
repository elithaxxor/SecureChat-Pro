import { Security } from '../utils/cryptoEngine';
import { ErrorHandler } from '../utils/securityLogger';

export const encryptResponse = (req, res, next) => {
  const originalSend = res.send;
  res.send = (data) => {
    try {
      const encrypted = Security.encryptPayload(
        JSON.stringify(data),
        req.session.clientKey
      );
      originalSend.call(res, encrypted);
    } catch (error) {
      ErrorHandler.logCryptoFailure(error);
      res.status(500).send('Encryption failed');
    }
  };
  next();
};

export const decryptRequest = (req, res, next) => {
  try {
    req.body = Security.decryptPayload(
      req.body,
      req.headers['x-client-key']
    );
    next();
  } catch (error) {
    ErrorHandler.logCryptoFailure(error);
    res.status(400).send('Invalid encrypted payload');
  }
};
