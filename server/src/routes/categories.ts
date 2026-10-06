import { Router } from 'express';
import { Category } from '../models/Category';
import { Product } from '../models/Product';

const router = Router();

router.get('/', async (_req, res) => {
  const categories = await Category.find().lean();
  const counts = await Product.aggregate<{ _id: string; count: number }>([
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);
  const bySlug = new Map(counts.map((row) => [row._id, row.count]));

  res.json({
    categories: categories.map((category) => ({
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      blurb: category.blurb,
      image: category.image,
      accent: category.accent,
      count: bySlug.get(category.slug) ?? 0,
    })),
  });
});

export default router;
