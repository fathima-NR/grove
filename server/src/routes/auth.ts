import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User';
import { dbReady } from '../config/db';
import { env } from '../config/env';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use((_req, res, next) => {
  if (!dbReady()) {
    res.status(503).json({ message: 'Sign-in opens once MongoDB is connected.' });
    return;
  }
  next();
});

const credentialsSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  email: z.string().trim().email().max(120),
  password: z.string().min(6).max(80),
});

function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: '7d' });
}

function publicUser(user: { _id: { toString(): string }; name: string; email: string }) {
  return { id: user._id.toString(), name: user.name, email: user.email };
}

router.post('/register', async (req, res) => {
  const parsed = credentialsSchema.extend({ name: z.string().trim().min(2).max(80) }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Enter a name, a valid email, and a password of at least 6 characters.' });
    return;
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409).json({ message: 'An account with that email already exists.' });
    return;
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = await User.create({ name: parsed.data.name, email, passwordHash });
  res.status(201).json({ token: signToken(user._id.toString()), user: publicUser(user) });
});

router.post('/login', async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Enter a valid email and password.' });
    return;
  }

  const user = await User.findOne({ email: parsed.data.email.toLowerCase() });
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
    res.status(401).json({ message: 'Those details do not match an account.' });
    return;
  }

  res.json({ token: signToken(user._id.toString()), user: publicUser(user) });
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    res.status(401).json({ message: 'Sign in to continue.' });
    return;
  }
  res.json({ user: publicUser(user) });
});

export default router;
