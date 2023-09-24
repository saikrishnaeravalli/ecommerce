// cart.component.ts

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/helpers/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  total: number = 0;
  cartForm: FormGroup;
  userId: string;
  productImages: { [productId: string]: SafeUrl } = {};

  constructor(private cartService: CartService, private fb: FormBuilder, private authService: AuthService,
    private productService: ProductService, private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef) {
    this.cartForm = this.fb.group({
      items: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.loadCartItems();
  }

  loadCartItems() {
    this.cartService.getCartItems(this.userId).subscribe(data => {
      this.cartItems = data;

      for (const cartItem of this.cartItems) {
        const productId = cartItem.productId._id; // Get the product ID

        if (cartItem.productId.images && cartItem.productId.images.length > 0) {
          this.productService.getFirstImage(cartItem.productId.images).subscribe((image: Blob) => {
            // Convert the Blob to a safe URL
            const imageUrl = URL.createObjectURL(image);
            this.productImages[productId] = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
          });
        } else {
          // Handle the case when there are no images for the product
          this.productImages[productId] = ''; // or provide a default image URL here
        }
      }
      this.calculateTotal();
      this.populateCartForm();
    });
  }


  populateCartForm() {
    const itemsFormArray = this.cartForm.get('items') as FormArray;

    // Clear any existing form controls
    while (itemsFormArray.length > 0) {
      itemsFormArray.removeAt(0);
    }

    this.cartItems.forEach(item => {
      itemsFormArray.push(
        this.fb.group({
          cartItemId: item._id,
          quantity: [item.quantity, [Validators.required, Validators.min(1)]]
        })
      );
    });
  }


  updateQuantity(index: number) {
    const itemsFormArray = this.cartForm.get('items') as FormArray;
    const cartItemId = itemsFormArray.at(index).get('cartItemId').value;
    const quantity = itemsFormArray.at(index).get('quantity').value;

    this.cartService.updateCartItem(cartItemId, quantity).subscribe((res) => {
      if (res.success) {
        this.loadCartItems();
        this.cdr.detectChanges();
      }
    });
  }

  removeItem(index: number) {
    const itemsFormArray = this.cartForm.get('items') as FormArray;
    const cartItemId = itemsFormArray.at(index).get('cartItemId').value;

    this.cartService.removeCartItem(cartItemId).subscribe((res) => {
      if (res.success) {
        this.loadCartItems();
      }
    });
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((acc, item) => {
      return acc + item.productId.price * item.quantity;
    }, 0);
  }
}
