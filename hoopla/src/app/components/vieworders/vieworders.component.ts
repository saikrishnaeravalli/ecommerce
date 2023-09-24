import { Component, OnInit } from "@angular/core";
import { ViewOrdersService } from "src/app/services/view-orders.service";

@Component({
  selector: "app-vieworders",
  templateUrl: "./vieworders.component.html",
  styleUrls: ["./vieworders.component.css"],
})
export class ViewordersComponent implements OnInit {
  orders: any[] = [];

  constructor(private service: ViewOrdersService) { }

  ngOnInit(): void {
    this.service.getOrders().subscribe(
      (data) => {
        this.orders = data;
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

}
