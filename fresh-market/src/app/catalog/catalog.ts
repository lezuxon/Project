import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, NavigationEnd, Router } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { CartService } from '../services/cart.service';
import { NotificationService } from '../services/notification.service';
import { Product } from '../models/product.model';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './catalog.html',
  styleUrls: ['./catalog.scss'],
})
export class CatalogComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadProducts();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.loadProducts();
      });
  }

  private loadProducts(): void {
    this.productsService
      .getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Product[]) => {
          this.products = data;
          this.cdr.markForCheck();
        },
        error: (err: Error) => {
          console.error('შეცდომა პროდუქტების წამოღებისას', err);
        },
      });
  }

  addToCart(product: Product): void {
    this.cartService
      .addToCart(product)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(`${product.name} დაემატა კალათაში`);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.notificationService.error('შეცდომა კალათაში დამატებისას');
          console.error('შეცდომა კალათაში დამატებისას', err);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
