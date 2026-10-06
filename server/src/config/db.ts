import mongoose from 'mongoose';
import { env } from './env';

type MemoryServer = { getUri(): string; stop(): Promise<boolean> };

let memoryServer: MemoryServer | null = null;

export function dbReady(): boolean {
  return mongoose.connection.readyState === 1;
}

export async function connectDb(): Promise<boolean> {
  let uri = env.mongoUri;

  if (!uri) {
    if (env.production) {
      console.log('MongoDB: not configured. The shop will use the built-in catalog until MONGODB_URI is set.');
      return false;
    }
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create({
      binary: { version: '7.0.14' },
    });
    uri = memoryServer.getUri();
    console.log('MongoDB: in-memory database (set MONGODB_URI for a persistent server).');
  } else {
    console.log('MongoDB: connecting to configured database.');
  }

  try {
    await mongoose.connect(uri);
    return true;
  } catch (error) {
    console.error('MongoDB connection failed:', error instanceof Error ? error.message : error);
    return false;
  }
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
