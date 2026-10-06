import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { env } from './env';

let memoryServer: MongoMemoryServer | null = null;

export async function connectDb(): Promise<string> {
  let uri = env.mongoUri;

  if (!uri) {
    memoryServer = await MongoMemoryServer.create({
      binary: { version: '7.0.14' },
    });
    uri = memoryServer.getUri();
    console.log('MongoDB: in-memory database (set MONGODB_URI for a persistent server).');
  } else {
    console.log('MongoDB: connecting to configured URI.');
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
