import bcrypt from 'bcryptjs';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { categories, products } from './catalog';

export async function seedIfEmpty(): Promise<void> {
  const count = await Product.countDocuments();
  if (count > 0) return;

  await Category.insertMany(categories);
  await Product.insertMany(products);

  const passwordHash = await bcrypt.hash('grove123', 10);
  await User.create({
    name: 'Demo Shopper',
    email: 'demo@grove.market',
    passwordHash,
  });

  console.log('Seeded catalog and demo account (demo@grove.market / grove123).');
}
