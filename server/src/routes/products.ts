import { Router } from 'express';
import { dbReady } from '../config/db';
import { Product } from '../models/Product';
import { products as catalog } from '../seed/catalog';

const router = Router();

function present(product: {
  _id: { toString(): string };
  name: string;
  slug: string;
  description: string;
  details: string;
  price: number;
  unit: string;
  category: string;
  image: string;
  badge?: string;
  rating: number;
  reviewCount: number;
  stock: number;
  featured?: boolean;
  seasonal?: boolean;
  origin: string;
}) {
  return {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    description: product.description,
    details: product.details,
    price: product.price,
    unit: product.unit,
    category: product.category,
    image: product.image,
    badge: product.badge ?? '',
    rating: product.rating,
    reviewCount: product.reviewCount,
    stock: product.stock,
    featured: Boolean(product.featured),
    seasonal: Boolean(product.seasonal),
    origin: product.origin,
  };
}

function fromCatalog(product: (typeof catalog)[number]) {
  return {
    id: product.slug,
    name: product.name,
    slug: product.slug,
    description: product.description,
    details: product.details,
    price: product.price,
    unit: product.unit,
    category: product.category,
    image: product.image,
    badge: product.badge,
    rating: product.rating,
    reviewCount: product.reviewCount,
    stock: product.stock,
    featured: product.featured,
    seasonal: product.seasonal,
    origin: product.origin,
  };
}

router.get('/', async (req, res) => {
  const category = typeof req.query.category === 'string' ? req.query.category : '';
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  const featured = req.query.featured === 'true';
  const seasonal = req.query.seasonal === 'true';
  const sort = typeof req.query.sort === 'string' ? req.query.sort : 'featured';

  if (!dbReady()) {
    let list = catalog.filter((product) => {
      if (category && product.category !== category) return false;
      if (featured && !product.featured) return false;
      if (seasonal && !product.seasonal) return false;
      if (q) {
        const haystack = `${product.name} ${product.description} ${product.origin}`.toLowerCase();
        if (!haystack.includes(q.toLowerCase())) return false;
      }
      return true;
    });
    list = list.slice().sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'rating') return b.rating - a.rating;
      return Number(b.featured) - Number(a.featured) || b.rating - a.rating;
    });
    const products = list.map(fromCatalog);
    res.json({ products, total: products.length });
    return;
  }

  const filter: Record<string, unknown> = {};
  if (category) filter.category = category;
  if (featured) filter.featured = true;
  if (seasonal) filter.seasonal = true;
  if (q) {
    const pattern = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: pattern }, { description: pattern }, { origin: pattern }];
  }

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    featured: { featured: -1, rating: -1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    name: { name: 1 },
    rating: { rating: -1 },
  };

  const products = await Product.find(filter).sort(sortMap[sort] ?? sortMap.featured);
  res.json({ products: products.map(present), total: products.length });
});

router.get('/:slug', async (req, res) => {
  if (!dbReady()) {
    const product = catalog.find((item) => item.slug === req.params.slug);
    if (!product) {
      res.status(404).json({ message: 'That product is no longer in the market.' });
      return;
    }
    const related = catalog
      .filter((item) => item.category === product.category && item.slug !== product.slug)
      .slice(0, 3)
      .map(fromCatalog);
    res.json({ product: fromCatalog(product), related });
    return;
  }

  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) {
    res.status(404).json({ message: 'That product is no longer in the market.' });
    return;
  }

  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  }).limit(3);

  res.json({ product: present(product), related: related.map(present) });
});

export default router;
