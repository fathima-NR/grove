import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../core/cart.service';
import { FREE_SHIPPING_AT, formatMoney } from '../core/money';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  readonly cart = inject(CartService);
  readonly money = formatMoney;
  readonly freeAt = FREE_SHIPPING_AT;

  remaining(): number {
    return Math.max(this.freeAt - this.cart.subtotal(), 0);
  }
}
