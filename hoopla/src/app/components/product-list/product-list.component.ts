import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/helpers/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {

  @Input() categoryFilter: string | null;
  products: any[] = [];
  productImages: { [productId: string]: SafeUrl } = {};
  userType = "C";
  userId: string;

  constructor(private productService: ProductService, private sanitizer: DomSanitizer, private authService: AuthService,
    private cartService: CartService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.userType = this.authService.getUserRole();
    this.userId = this.authService.getUserId();
    // Load products based on the categoryFilter if it's provided
    if (this.categoryFilter !== null) {
      this.loadProducts(this.categoryFilter);
    } else {
      // Load all products if no category filter is provided
      this.loadProducts();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.categoryFilter && !changes.categoryFilter.firstChange) {
      // When the categoryFilter input property changes, fetch products based on the new category
      if (this.categoryFilter !== null) {
        this.loadProducts(this.categoryFilter);
      } else {
        // Load all products if no category filter is provided
        this.loadProducts();
      }
    }
  }

  loadProducts(category?: string) {
    const endpoint = category ? `products?category=${category}` : 'products';
    this.productService.getProducts(endpoint).subscribe((data) => {
      this.products = data;

      // Assuming that each product has an 'images' property which is an array of image IDs
      for (const product of this.products) {
        if (product.images && product.images.length > 0) {
          this.productService.getFirstImage(product.images).subscribe((image: Blob) => {
            // Convert the Blob to a safe URL
            const imageUrl = URL.createObjectURL(image);
            this.productImages[product._id] = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
          });
        } else {
          // Handle the case when there are no images
          this.productImages[product._id] = ''; // or provide a default image URL here
        }
      }
    });
  }

  // Other methods for interacting with products, e.g., addToCart, buyNow, etc.
  deleteProduct(productId: string) {
    // Call the deleteProduct method from the ProductService
    this.productService.deleteProduct(productId).subscribe(() => {
      // If the deletion is successful, update the product list
      this.loadProducts();
    });
  }

  addToCart(product: any): void {
    const productId = product._id;

    // Pass the userId when calling addToCart
    this.cartService.addToCart(productId, this.userId).subscribe(
      (response) => {
        // Show a success notification
        this.snackBar.open('Item added to cart', 'Close', {
          duration: 2000, // Adjust the duration as needed
        });
      },
      (error) => {
        // Show an error notification
        this.snackBar.open('Failed to add item to cart', 'Close', {
          duration: 2000, // Adjust the duration as needed
        });
      }
    );
  }

}
