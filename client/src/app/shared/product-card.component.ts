import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../core/cart.service';
import { formatMoney } from '../core/money';
import { Product } from '../core/models';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  private readonly cart = inject(CartService);
  readonly money = formatMoney;

  add(): void {
    this.cart.add(this.product());
  }
}
