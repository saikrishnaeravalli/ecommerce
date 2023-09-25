import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { AuthService } from 'src/app/helpers/auth.service';
import { ViewOrdersService } from 'src/app/services/view-orders.service';

@Component({
  selector: 'app-seller-orders',
  templateUrl: './seller-orders.component.html',
  styleUrls: ['./seller-orders.component.css']
})
export class SellerOrdersComponent implements OnInit {

  constructor(private service: ViewOrdersService, private authService: AuthService) { }

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  userId: string;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['orderID', 'orderDate', 'itemDetails'];

  // Define displayed columns for inner table (item details)
  displayedItemColumns: string[] = ['productName', 'price', 'quantity'];

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.service.getOrderBySeller(this.userId).subscribe(
      (res) => {
        console.log(res)
        this.dataSource = new MatTableDataSource(res);

        // Set the initial sort direction to descending for "orderDate" column
        this.sort.active = 'orderDate';
        this.sort.direction = 'asc';

        this.dataSource.sort = this.sort;
      },
      (err) => {
        console.log(err)
      }
    )
  }
}
