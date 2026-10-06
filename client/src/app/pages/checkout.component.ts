import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { CartService } from '../core/cart.service';
import { formatMoney } from '../core/money';
import { OrderService } from '../core/order.service';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
  readonly cart = inject(CartService);
  readonly auth = inject(AuthService);
  private readonly orders = inject(OrderService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly money = formatMoney;
  readonly saving = signal(false);
  readonly error = signal('');

  readonly form = this.fb.nonNullable.group({
    fullName: [this.auth.user()?.name ?? '', [Validators.required, Validators.minLength(2)]],
    line1: ['', [Validators.required, Validators.minLength(4)]],
    city: ['', [Validators.required, Validators.minLength(2)]],
    postalCode: ['', [Validators.required, Validators.minLength(3)]],
    country: ['United Arab Emirates', [Validators.required]],
    notes: [''],
  });

  place(): void {
    this.error.set('');
    if (this.cart.items().length === 0) {
      this.error.set('Your basket is empty.');
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Add a name and a full delivery address.');
      return;
    }

    this.saving.set(true);
    const { notes, ...address } = this.form.getRawValue();
    this.orders
      .place(
        this.cart.items().map((item) => ({ productId: item.productId, quantity: item.quantity })),
        address,
        notes,
      )
      .subscribe({
        next: (res) => {
          this.cart.clear();
          void this.router.navigate(['/orders'], { queryParams: { placed: res.order.id } });
        },
        error: (err: HttpErrorResponse) => {
          this.saving.set(false);
          this.error.set(err.error?.message ?? 'We could not place that order.');
        },
      });
  }
}
