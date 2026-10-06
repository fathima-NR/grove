import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? 'grove-dev-secret-change-me',
  mongoUri: process.env.MONGODB_URI?.trim() ?? '',
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:4200',
};
