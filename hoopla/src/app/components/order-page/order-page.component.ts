import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { ViewOrdersService } from 'src/app/services/view-orders.service';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css']
})
export class OrderPageComponent implements OnInit {

  order: {} | null = null;
  productImages: { [productId: string]: SafeUrl } = {};
  orderItems = [];


  constructor(
    private route: ActivatedRoute,
    private orderService: ViewOrdersService,
    private productService: ProductService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.orderService.getOrderById(orderId).subscribe((order) => {
        this.order = order;
        this.orderItems = order.items
        if (this.orderItems) {
          for (const orderItem of this.orderItems) {
            const productId = orderItem.productId._id; // Get the product ID

            if (orderItem.productId.images && orderItem.productId.images.length > 0) {
              this.productService.getFirstImage(orderItem.productId.images).subscribe((image: Blob) => {
                // Convert the Blob to a safe URL
                const imageUrl = URL.createObjectURL(image);
                this.productImages[productId] = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
              });
            } else {
              // Handle the case when there are no images for the product
              this.productImages[productId] = ''; // or provide a default image URL here
            }
          }
        }
      });
    }
  }

}
