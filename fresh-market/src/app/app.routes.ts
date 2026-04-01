import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { CatalogComponent } from './catalog/catalog';
import { ProductDetailsComponent } from './product-details/product-details';
import { CartComponent } from './cart/cart';
import { ProfileComponent } from './profile/profile';

export const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'catalog', component: CatalogComponent, data: { prerender: false } },
  { path: 'catalog/:id', component: ProductDetailsComponent, data: { prerender: false } },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'catalog' },
];
