import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/helpers/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  productImages: { [productId: string]: SafeUrl } = {};
  userType = "C";

  constructor(private productService: ProductService, private sanitizer: DomSanitizer, private authService: AuthService) { }

  ngOnInit(): void {
    this.userType = this.authService.getUserRole();
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe((data) => {
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

}
