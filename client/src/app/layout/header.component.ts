import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { CartService } from '../core/cart.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  readonly auth = inject(AuthService);
  readonly cart = inject(CartService);
  private readonly router = inject(Router);

  readonly query = signal('');
  readonly menuOpen = signal(false);

  search(event: Event): void {
    event.preventDefault();
    const q = this.query().trim();
    this.menuOpen.set(false);
    void this.router.navigate(['/shop'], { queryParams: q ? { q } : {} });
  }

  close(): void {
    this.menuOpen.set(false);
  }

  logout(): void {
    this.auth.logout();
    this.close();
    void this.router.navigate(['/']);
  }
}
