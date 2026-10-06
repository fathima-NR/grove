import { createApp } from './app';
import { env } from './config/env';
import { connectDb, disconnectDb } from './config/db';
import { seedIfEmpty } from './seed/seed';

async function main() {
  const connected = await connectDb();
  if (connected) await seedIfEmpty();

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`Grove API listening on http://localhost:${env.port}`);
  });

  const shutdown = async () => {
    server.close();
    await disconnectDb();
    process.exit(0);
  };

  process.on('SIGINT', () => {
    void shutdown();
  });
  process.on('SIGTERM', () => {
    void shutdown();
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
