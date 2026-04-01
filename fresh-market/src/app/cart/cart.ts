import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { NotificationService } from '../services/notification.service';
import { Product } from '../models/product.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: Product[] = [];
  totalPrice: number = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.pipe(takeUntil(this.destroy$)).subscribe((items) => {
      this.cartItems = items;
      this.totalPrice = this.cartService.getTotalPrice();
      this.cdr.markForCheck();
    });
  }

  removeItem(id: string): void {
    this.cartService
      .removeFromCart(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success('პროდუქტი წაიშალა კალათიდან');
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.notificationService.error('შეცდომა ელემენტის წაშლისას');
          console.error('შეცდომა ელემენტის წაშლისას:', err);
        },
      });
  }

  checkout(): void {
    this.notificationService.success('მადლობა! შეკვეთა მიღებულია.');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
