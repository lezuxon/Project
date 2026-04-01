import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:3000/cart';
  private cartItemsSubject = new BehaviorSubject<Product[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  loadCart(): void {
    this.http.get<Product[]>(this.apiUrl).subscribe((items) => {
      this.cartItemsSubject.next(items);
    });
  }

  addToCart(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      tap(() => {
        this.loadCart();
      }),
    );
  }

  removeFromCart(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.loadCart();
      }),
    );
  }

  getTotalPrice(): number {
    return this.cartItemsSubject.value.reduce((acc, item) => acc + item.price, 0);
  }
}
