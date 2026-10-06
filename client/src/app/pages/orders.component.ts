import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { formatMoney } from '../core/money';
import { Order } from '../core/models';
import { OrderService } from '../core/order.service';

const STATUS: Record<string, string> = {
  preparing: 'Preparing',
  packed: 'Packed',
  'out-for-delivery': 'Out for delivery',
  delivered: 'Delivered',
};

@Component({
  selector: 'app-orders',
  imports: [RouterLink, DatePipe],
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
  private readonly ordersApi = inject(OrderService);
  private readonly route = inject(ActivatedRoute);

  readonly orders = signal<Order[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly placed = signal(this.route.snapshot.queryParamMap.get('placed'));
  readonly money = formatMoney;
  readonly statusLabel = (status: string) => STATUS[status] ?? status;

  ngOnInit(): void {
    this.ordersApi.list().subscribe({
      next: (res) => {
        this.orders.set(res.orders);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('We could not load your orders.');
      },
    });
  }
}
