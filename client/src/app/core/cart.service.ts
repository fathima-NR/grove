import { Injectable, computed, signal } from '@angular/core';
import { CartItem, Product } from './models';
import { shippingFor } from './money';

const CART_KEY = 'grove-cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal<CartItem[]>(this.read());
  readonly notice = signal('');
  readonly count = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
  readonly subtotal = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0),
  );
  readonly shipping = computed(() => shippingFor(this.subtotal()));
  readonly total = computed(() => this.subtotal() + this.shipping());

  private timer: ReturnType<typeof setTimeout> | null = null;

  add(product: Product, quantity = 1): void {
    const items = this.items().slice();
    const existing = items.find((item) => item.productId === product.id);
    const nextQty = (existing?.quantity ?? 0) + quantity;
    if (nextQty > product.stock) {
      this.flash(`Only ${product.stock} ${product.name} left today.`);
      return;
    }

    if (existing) {
      existing.quantity = nextQty;
      existing.stock = product.stock;
    } else {
      items.push({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        unit: product.unit,
        image: product.image,
        quantity,
        stock: product.stock,
      });
    }

    this.items.set(items);
    this.persist();
    this.flash(`${product.name} added to your basket.`);
  }

  setQuantity(productId: string, quantity: number): void {
    const items = this.items()
      .map((item) => {
        if (item.productId !== productId) return item;
        const next = Math.min(Math.max(quantity, 1), item.stock);
        return { ...item, quantity: next };
      });
    this.items.set(items);
    this.persist();
  }

  remove(productId: string): void {
    this.items.set(this.items().filter((item) => item.productId !== productId));
    this.persist();
  }

  clear(): void {
    this.items.set([]);
    this.persist();
  }

  private flash(message: string): void {
    this.notice.set(message);
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.notice.set(''), 2600);
  }

  private persist(): void {
    localStorage.setItem(CART_KEY, JSON.stringify(this.items()));
  }

  private read(): CartItem[] {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as CartItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
