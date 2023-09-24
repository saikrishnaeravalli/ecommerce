import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/helpers/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  step: number = 0;
  userId: string;
  cartItems: any[] = [];
  productImages: { [productId: string]: SafeUrl } = {};
  total: number = 0;
  orderPlaced: boolean = false;
  orderNumber:string;


  constructor(private fb: FormBuilder, private authService: AuthService, private cartService: CartService,
    private productService: ProductService, private sanitizer: DomSanitizer, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      shippingInformation: this.fb.group({
        fullName: ['', Validators.required],
        address1: ['', Validators.required],
        address2: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
        zipcode: ['', Validators.required],
      }),
      // Add more form groups for payment information, order summary, etc.
    });
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
    });
  }

  setStep(index: number) {
    this.step = index;
  }

  prevStep() {
    this.step--;
  }

  nextStep() {
    this.step++;
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((acc, item) => {
      return acc + item.productId.price * item.quantity;
    }, 0);
  }

  onSubmit() {
    // Handle form submission here (e.g., validation, saving data)
    if (this.checkoutForm.valid) {
      // Proceed to the next step or handle as needed
      this.nextStep();
    }
  }

  placeOrder() {
    // Check if the form is valid before placing the order
    if (this.checkoutForm.valid) {
      // Prepare the order data based on your model
      console.log(this.cartItems)
      const orderData = {
        shippingInformation: this.checkoutForm.get('shippingInformation').value,
        items: this.cartItems.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price
        })),
        totalAmount: this.total,
        userId:this.userId
      };

      // Send a POST request to your backend to create a new order
      this.cartService.addOrder(orderData)
        .subscribe(
          (response) => {
            // Handle a successful order creation response
            console.log('Order placed successfully:', response);

            this.cartService.clearCart(this.userId).subscribe(
              () => {
                console.log('clearCart completed successfully');
                this.orderPlaced = true;
                this.orderNumber = response.orderID
              },
              (error) => {
                console.log('clearCart error:', error);
              }
            );
          },
          (error) => {
            // Handle an error response from the server
            console.error('Error placing order:', error);

            // Show an error message to the user
            this.snackBar.open('Failed to place the order. Please try again later.', 'Close', {
              duration: 3000, // 3 seconds
            });
          }
        );
    }
  }
}
