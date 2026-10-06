import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { AboutComponent } from './pages/about.component';
import { AuthComponent } from './pages/auth.component';
import { CartComponent } from './pages/cart.component';
import { CheckoutComponent } from './pages/checkout.component';
import { HomeComponent } from './pages/home.component';
import { OrdersComponent } from './pages/orders.component';
import { ProductComponent } from './pages/product.component';
import { ShopComponent } from './pages/shop.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'product/:slug', component: ProductComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [authGuard] },
  { path: 'login', component: AuthComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' },
];
