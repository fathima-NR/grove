import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CatalogService } from '../core/catalog.service';
import { Category, Product } from '../core/models';
import { ProductCardComponent } from '../shared/product-card.component';

@Component({
  selector: 'app-shop',
  imports: [ProductCardComponent],
  templateUrl: './shop.component.html',
})
export class ShopComponent implements OnInit, OnDestroy {
  private readonly catalog = inject(CatalogService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private sub: Subscription | null = null;

  readonly categories = signal<Category[]>([]);
  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly category = signal('');
  readonly q = signal('');
  readonly sort = signal('featured');
  readonly seasonal = signal(false);

  ngOnInit(): void {
    this.catalog.categories().subscribe({
      next: (res) => this.categories.set(res.categories),
    });

    this.sub = this.route.queryParamMap.subscribe((params) => {
      this.category.set(params.get('category') ?? '');
      this.q.set(params.get('q') ?? '');
      this.sort.set(params.get('sort') ?? 'featured');
      this.seasonal.set(params.get('seasonal') === 'true');
      this.load();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  title(): string {
    if (this.q()) return `Results for “${this.q()}”`;
    if (this.seasonal()) return "This week's harvest";
    const match = this.categories().find((item) => item.slug === this.category());
    return match?.name ?? 'The market';
  }

  chooseCategory(slug: string): void {
    void this.router.navigate(['/shop'], {
      queryParams: {
        category: slug || null,
        q: this.q() || null,
        sort: this.sort() === 'featured' ? null : this.sort(),
        seasonal: this.seasonal() ? 'true' : null,
      },
    });
  }

  changeSort(value: string): void {
    void this.router.navigate(['/shop'], {
      queryParams: {
        category: this.category() || null,
        q: this.q() || null,
        sort: value === 'featured' ? null : value,
        seasonal: this.seasonal() ? 'true' : null,
      },
    });
  }

  private load(): void {
    this.loading.set(true);
    this.error.set('');
    this.catalog
      .products({
        category: this.category() || undefined,
        q: this.q() || undefined,
        seasonal: this.seasonal() || undefined,
        sort: this.sort(),
      })
      .subscribe({
        next: (res) => {
          this.products.set(res.products);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set('We could not load the market. Please refresh in a moment.');
        },
      });
  }
}
