import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from './api';
import { Address, Order } from './models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);

  list() {
    return this.http.get<{ orders: Order[] }>(`${API_URL}/orders`);
  }

  place(items: { productId: string; quantity: number }[], address: Address, notes: string) {
    return this.http.post<{ order: Order }>(`${API_URL}/orders`, { items, address, notes });
  }
}
