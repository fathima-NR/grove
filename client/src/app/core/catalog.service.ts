import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from './api';
import { Category, Product } from './models';

export interface ProductQuery {
  category?: string;
  q?: string;
  featured?: boolean;
  seasonal?: boolean;
  sort?: string;
}

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);

  categories() {
    return this.http.get<{ categories: Category[] }>(`${API_URL}/categories`);
  }

  products(query: ProductQuery = {}) {
    let params = new HttpParams();
    if (query.category) params = params.set('category', query.category);
    if (query.q) params = params.set('q', query.q);
    if (query.featured) params = params.set('featured', 'true');
    if (query.seasonal) params = params.set('seasonal', 'true');
    if (query.sort) params = params.set('sort', query.sort);
    return this.http.get<{ products: Product[]; total: number }>(`${API_URL}/products`, { params });
  }

  product(slug: string) {
    return this.http.get<{ product: Product; related: Product[] }>(`${API_URL}/products/${slug}`);
  }
}
