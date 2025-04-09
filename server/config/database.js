import { Security } from '../utils/cryptoEngine';

export default {
  uri: process.env.MONGO_URI,
  options: {
    autoIndex: false,
    ssl: true,
    sslValidate: true,
    sslCA: Security.decryptFile('./certs/db-ca.pem.enc'),
    authMechanism: 'SCRAM-SHA-256',
    auth: {
      username: Security.decryptEnv('DB_USER'),
      password: Security.decryptEnv('DB_PASS')
    }
  }
};
