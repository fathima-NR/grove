import dotenv from 'dotenv';

dotenv.config();

function mongoUri(): string {
  const direct = process.env.MONGODB_URI?.trim();
  if (direct) return direct;

  const host = process.env.MONGO_HOST?.trim();
  if (host) return `mongodb://${host}:27017/grove`;

  return '';
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? 'grove-dev-secret-change-me',
  mongoUri: mongoUri(),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:4200',
  production: process.env.NODE_ENV === 'production',
};
