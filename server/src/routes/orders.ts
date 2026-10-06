import { Router } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { requireAuth } from '../middleware/auth';
import { roundMoney, shippingFor } from '../lib/money';

const router = Router();

const orderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1),
  address: z.object({
    fullName: z.string().trim().min(2).max(80),
    line1: z.string().trim().min(4).max(140),
    city: z.string().trim().min(2).max(80),
    postalCode: z.string().trim().min(3).max(16),
    country: z.string().trim().min(2).max(80),
  }),
  notes: z.string().trim().max(240).optional(),
});

router.use(requireAuth);

router.get('/', async (req, res) => {
  const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json({
    orders: orders.map((order) => ({
      id: order._id.toString(),
      items: order.items,
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      status: order.status,
      address: order.address,
      notes: order.notes,
      createdAt: order.createdAt,
    })),
  });
});

router.post('/', async (req, res) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Check the basket and delivery details, then try again.' });
    return;
  }

  if (parsed.data.items.some((item) => !Types.ObjectId.isValid(item.productId))) {
    res.status(400).json({ message: 'One of the products in your basket is no longer available.' });
    return;
  }

  const ids = parsed.data.items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: ids } });
  const byId = new Map(products.map((product) => [product._id.toString(), product]));

  const lineItems = [];
  for (const item of parsed.data.items) {
    const product = byId.get(item.productId);
    if (!product) {
      res.status(400).json({ message: 'One of the products in your basket is no longer available.' });
      return;
    }
    if (product.stock < item.quantity) {
      res.status(400).json({ message: `Only ${product.stock} left of ${product.name}.` });
      return;
    }
    lineItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.image,
      unit: product.unit,
    });
  }

  const decremented: { productId: string; quantity: number }[] = [];
  for (const item of parsed.data.items) {
    const updated = await Product.findOneAndUpdate(
      { _id: item.productId, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
    );
    if (!updated) {
      await Promise.all(
        decremented.map((row) =>
          Product.updateOne({ _id: row.productId }, { $inc: { stock: row.quantity } }),
        ),
      );
      res.status(409).json({ message: 'Stock changed while we packed your order. Please review your basket.' });
      return;
    }
    decremented.push(item);
  }

  const subtotal = roundMoney(lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0));
  const shipping = shippingFor(subtotal);
  const total = roundMoney(subtotal + shipping);

  const order = await Order.create({
    user: req.userId,
    items: lineItems,
    subtotal,
    shipping,
    total,
    address: parsed.data.address,
    notes: parsed.data.notes ?? '',
  });

  res.status(201).json({
    order: {
      id: order._id.toString(),
      items: order.items,
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      status: order.status,
      address: order.address,
      createdAt: order.createdAt,
    },
  });
});

export default router;
