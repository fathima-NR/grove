import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartService } from './core/cart.service';
import { FooterComponent } from './layout/footer.component';
import { HeaderComponent } from './layout/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  readonly cart = inject(CartService);
}
