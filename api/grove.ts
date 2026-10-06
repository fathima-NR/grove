import type { IncomingMessage, ServerResponse } from 'http';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { categories, products as catalogProducts } from '../server/src/seed/catalog';

const JWT_SECRET = process.env.JWT_SECRET || 'grove-dev-secret-change-me';
const FREE_SHIPPING_AT = 40;
const SHIPPING_FEE = 5.95;

interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

interface OrderRecord {
  id: string;
  userId: string;
  items: { name: string; price: number; quantity: number; image: string; unit: string }[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  address: {
    fullName: string;
    line1: string;
    city: string;
    postalCode: string;
    country: string;
  };
  notes: string;
  createdAt: string;
}

interface Store {
  users: UserRecord[];
  orders: OrderRecord[];
  stock: Record<string, number>;
}

const globalStore = globalThis as typeof globalThis & { __grove?: Store };

function store(): Store {
  if (!globalStore.__grove) {
    globalStore.__grove = {
      users: [
        {
          id: 'demo-shopper',
          name: 'Demo Shopper',
          email: 'demo@grove.market',
          passwordHash: bcrypt.hashSync('grove123', 10),
        },
      ],
      orders: [],
      stock: Object.fromEntries(catalogProducts.map((product) => [product.slug, product.stock])),
    };
  }
  return globalStore.__grove;
}

function presentProduct(product: (typeof catalogProducts)[number]) {
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
    stock: store().stock[product.slug] ?? product.stock,
    featured: product.featured,
    seasonal: product.seasonal,
    origin: product.origin,
  };
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function send(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

function readBody(req: IncomingMessage & { body?: unknown }): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === 'object') {
    return Promise.resolve(req.body as Record<string, unknown>);
  }
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw) as Record<string, unknown>);
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function userFromAuth(req: IncomingMessage): UserRecord | null {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET) as { sub: string };
    return store().users.find((user) => user.id === payload.sub) ?? null;
  } catch {
    return null;
  }
}

function publicUser(user: UserRecord) {
  return { id: user.id, name: user.name, email: user.email };
}

function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' });
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = new URL(req.url || '/', 'http://localhost');
  const path = url.pathname.replace(/^\/api/, '') || '/';
  const method = req.method || 'GET';

  try {
    if (method === 'GET' && path === '/health') {
      send(res, 200, { ok: true, service: 'grove-market' });
      return;
    }

    if (method === 'POST' && path === '/auth/register') {
      const body = await readBody(req as IncomingMessage & { body?: unknown });
      const name = String(body.name ?? '').trim();
      const email = String(body.email ?? '').trim().toLowerCase();
      const password = String(body.password ?? '');
      if (name.length < 2 || !email.includes('@') || password.length < 6) {
        send(res, 400, { message: 'Enter a name, a valid email, and a password of at least 6 characters.' });
        return;
      }
      if (store().users.some((user) => user.email === email)) {
        send(res, 409, { message: 'An account with that email already exists.' });
        return;
      }
      const user: UserRecord = {
        id: `user-${Date.now()}`,
        name,
        email,
        passwordHash: bcrypt.hashSync(password, 10),
      };
      store().users.push(user);
      send(res, 201, { token: signToken(user.id), user: publicUser(user) });
      return;
    }

    if (method === 'POST' && path === '/auth/login') {
      const body = await readBody(req as IncomingMessage & { body?: unknown });
      const email = String(body.email ?? '').trim().toLowerCase();
      const password = String(body.password ?? '');
      const user = store().users.find((item) => item.email === email);
      if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        send(res, 401, { message: 'Those details do not match an account.' });
        return;
      }
      send(res, 200, { token: signToken(user.id), user: publicUser(user) });
      return;
    }

    if (method === 'GET' && path === '/auth/me') {
      const user = userFromAuth(req);
      if (!user) {
        send(res, 401, { message: 'Sign in to continue.' });
        return;
      }
      send(res, 200, { user: publicUser(user) });
      return;
    }

    if (method === 'GET' && path === '/categories') {
      send(res, 200, {
        categories: categories.map((category) => ({
          id: category.slug,
          name: category.name,
          slug: category.slug,
          blurb: category.blurb,
          image: category.image,
          accent: category.accent,
          count: catalogProducts.filter((product) => product.category === category.slug).length,
        })),
      });
      return;
    }

    if (method === 'GET' && path === '/products') {
      const category = url.searchParams.get('category') ?? '';
      const q = (url.searchParams.get('q') ?? '').trim().toLowerCase();
      const featured = url.searchParams.get('featured') === 'true';
      const seasonal = url.searchParams.get('seasonal') === 'true';
      const sort = url.searchParams.get('sort') ?? 'featured';

      let list = catalogProducts.filter((product) => {
        if (category && product.category !== category) return false;
        if (featured && !product.featured) return false;
        if (seasonal && !product.seasonal) return false;
        if (q) {
          const haystack = `${product.name} ${product.description} ${product.origin}`.toLowerCase();
          if (!haystack.includes(q)) return false;
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

      const presented = list.map(presentProduct);
      send(res, 200, { products: presented, total: presented.length });
      return;
    }

    if (method === 'GET' && path.startsWith('/products/')) {
      const slug = decodeURIComponent(path.slice('/products/'.length));
      const product = catalogProducts.find((item) => item.slug === slug);
      if (!product) {
        send(res, 404, { message: 'That product is no longer in the market.' });
        return;
      }
      const related = catalogProducts.filter((item) => item.category === product.category && item.slug !== slug).slice(0, 3);
      send(res, 200, { product: presentProduct(product), related: related.map(presentProduct) });
      return;
    }

    if (path === '/orders') {
      const user = userFromAuth(req);
      if (!user) {
        send(res, 401, { message: 'Sign in to continue.' });
        return;
      }

      if (method === 'GET') {
        const orders = store()
          .orders.filter((order) => order.userId === user.id)
          .slice()
          .reverse();
        send(res, 200, { orders });
        return;
      }

      if (method === 'POST') {
        const body = await readBody(req as IncomingMessage & { body?: unknown });
        const items = Array.isArray(body.items) ? body.items : [];
        const address = (body.address ?? {}) as OrderRecord['address'];
        const notes = String(body.notes ?? '').trim();
        if (
          items.length === 0 ||
          !address.fullName ||
          !address.line1 ||
          !address.city ||
          !address.postalCode ||
          !address.country
        ) {
          send(res, 400, { message: 'Check the basket and delivery details, then try again.' });
          return;
        }

        const lineItems = [];
        for (const raw of items) {
          const item = raw as { productId?: string; quantity?: number };
          const product = catalogProducts.find((entry) => entry.slug === item.productId);
          const quantity = Number(item.quantity);
          if (!product || !Number.isInteger(quantity) || quantity < 1) {
            send(res, 400, { message: 'One of the products in your basket is no longer available.' });
            return;
          }
          const available = store().stock[product.slug] ?? 0;
          if (available < quantity) {
            send(res, 400, { message: `Only ${available} left of ${product.name}.` });
            return;
          }
          lineItems.push({ product, quantity });
        }

        for (const item of lineItems) {
          store().stock[item.product.slug] -= item.quantity;
        }

        const subtotal = roundMoney(lineItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0));
        const shipping = subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_FEE;
        const order: OrderRecord = {
          id: `order-${Date.now()}`,
          userId: user.id,
          items: lineItems.map((item) => ({
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image,
            unit: item.product.unit,
          })),
          subtotal,
          shipping,
          total: roundMoney(subtotal + shipping),
          status: 'preparing',
          address,
          notes,
          createdAt: new Date().toISOString(),
        };
        store().orders.push(order);
        const { userId: _userId, ...publicOrder } = order;
        send(res, 201, { order: publicOrder });
        return;
      }
    }

    send(res, 404, { message: 'Not found.' });
  } catch (error) {
    console.error(error);
    send(res, 500, { message: 'Something went wrong in the market. Please try again.' });
  }
}
