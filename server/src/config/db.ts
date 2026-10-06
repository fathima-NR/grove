import mongoose from 'mongoose';
import { env } from './env';

type MemoryServer = { getUri(): string; stop(): Promise<boolean> };

let memoryServer: MemoryServer | null = null;

export async function connectDb(): Promise<string> {
  let uri = env.mongoUri;

  if (!uri) {
    if (env.production) {
      throw new Error('Set MONGODB_URI or MONGO_HOST before starting Grove in production.');
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

  await mongoose.connect(uri);
  return uri;
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
