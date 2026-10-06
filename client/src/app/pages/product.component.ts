import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../core/cart.service';
import { CatalogService } from '../core/catalog.service';
import { formatMoney } from '../core/money';
import { Product } from '../core/models';
import { ProductCardComponent } from '../shared/product-card.component';

@Component({
  selector: 'app-product',
  imports: [RouterLink, ProductCardComponent],
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly catalog = inject(CatalogService);
  private readonly cart = inject(CartService);
  private sub: Subscription | null = null;

  readonly product = signal<Product | null>(null);
  readonly related = signal<Product[]>([]);
  readonly quantity = signal(1);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly money = formatMoney;

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (!slug) return;
      this.loading.set(true);
      this.quantity.set(1);
      this.catalog.product(slug).subscribe({
        next: (res) => {
          this.product.set(res.product);
          this.related.set(res.related);
          this.loading.set(false);
          this.error.set('');
        },
        error: () => {
          this.product.set(null);
          this.loading.set(false);
          this.error.set('That product has left the market.');
        },
      });
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  changeQty(delta: number): void {
    const product = this.product();
    if (!product) return;
    const next = Math.min(Math.max(this.quantity() + delta, 1), product.stock);
    this.quantity.set(next);
  }

  add(): void {
    const product = this.product();
    if (!product) return;
    this.cart.add(product, this.quantity());
  }
}
