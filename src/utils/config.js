import dotenv from 'dotenv';
import { config } from 'localforage';

dotenv.config();

const configuration = {
  port: process.env.PORT,
  gmail_password: process.env.GMAIL_PASSWORD,
  gmail_user: process.env.GMAIL_USER,
  jwtSecret: process.env.JWTSECRET,
};

export default configuration;
