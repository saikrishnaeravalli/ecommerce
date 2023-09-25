import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/helpers/auth.service";
import { ViewOrdersService } from "src/app/services/view-orders.service";

@Component({
  selector: "app-vieworders",
  templateUrl: "./vieworders.component.html",
  styleUrls: ["./vieworders.component.css"],
})
export class ViewordersComponent implements OnInit {
  orders: any[] = [];

  constructor(private service: ViewOrdersService,private authService:AuthService) { }

  ngOnInit(): void {
    this.service.getOrders(this.authService.getUserId()).subscribe(
      (data) => {
        this.orders = data;
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

}
