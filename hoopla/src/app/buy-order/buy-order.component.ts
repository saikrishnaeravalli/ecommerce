import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BuyService } from "./buy.service";

@Component({
  selector: "app-buy-order",
  templateUrl: "./buy-order.component.html",
  styleUrls: ["./buy-order.component.css"],
})
export class BuyOrderComponent implements OnInit {
public productid: any;
public errormessage: any;
public orderid: any;
public sesuser: any;
public productdetails: any;

  constructor(private actroute: ActivatedRoute, private buy: BuyService, private route: Router) { }
  public ngOnInit() {
    this.sesuser = sessionStorage.getItem("loginid");
    this.actroute.params.subscribe((success) => {
      this.productid = success.id; },
      (error) => {this.errormessage = error; },
    );
    this.buy.getorderdetails(this.productid, this.sesuser).subscribe((success) => {this.productdetails = (success); });
  }
public details() {
  this.route.navigate(["/dashboard"]);
}
public ord(input) {
  this.route.navigate(["/products", input]);
}
public logof() {
  sessionStorage.clear();
  this.route.navigate(["/login"]);
}
}
