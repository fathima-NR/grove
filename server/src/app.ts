import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import categoryRoutes from './routes/categories';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import { env } from './config/env';

export function createApp() {
  const app = express();

  const origins = Array.from(new Set([env.clientOrigin, 'http://localhost:4200', 'http://127.0.0.1:4200']));
  app.use(
    cors({
      origin: origins,
      credentials: true,
    }),
  );
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'grove-market' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);

  app.use((_req, res) => {
    res.status(404).json({ message: 'Not found.' });
  });

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong in the market. Please try again.' });
  });

  return app;
}
