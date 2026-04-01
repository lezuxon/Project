import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { CartService } from '../services/cart.service';
import { NotificationService } from '../services/notification.service';
import { Product } from '../models/product.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.scss'],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product: Product | undefined;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private cartService: CartService,
    private location: Location,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productsService
        .getProductById(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.product = data;
            this.cdr.markForCheck();
          },
          error: (err) => console.error('შეცდომა პროდუქტის ჩატვირთვისას:', err),
        });
    }
  }

  goBack(): void {
    this.location.back();
  }

  addToCart(product: Product): void {
    this.cartService
      .addToCart(product)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(`${product.name} დაემატა კალათაში.`);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.notificationService.error('შეცდომა კალათაში დამატებისას');
          console.error('შეცდომა კალათაში დამატებისას:', err);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
