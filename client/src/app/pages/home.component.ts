import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../core/catalog.service';
import { Category, Product } from '../core/models';
import { ProductCardComponent } from '../shared/product-card.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private readonly catalog = inject(CatalogService);

  readonly categories = signal<Category[]>([]);
  readonly featured = signal<Product[]>([]);
  readonly seasonal = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.catalog.categories().subscribe({
      next: (res) => this.categories.set(res.categories),
      error: () => this.error.set('The market is quiet right now. Please refresh in a moment.'),
    });

    this.catalog.products({ featured: true }).subscribe({
      next: (res) => {
        this.featured.set(res.products.slice(0, 8));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('The market is quiet right now. Please refresh in a moment.');
      },
    });

    this.catalog.products({ seasonal: true }).subscribe({
      next: (res) => this.seasonal.set(res.products.slice(0, 2)),
    });
  }
}
