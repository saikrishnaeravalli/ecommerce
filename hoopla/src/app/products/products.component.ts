import { Component, OnInit } from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { error } from "protractor";
import { ProductserviceService } from "./productservice.service";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent implements OnInit {
public orderid: any;
public errormessage: any;
public productdetails: any;
public sesuser: any;
public isavailable: boolean = true;

  constructor(private actroute: ActivatedRoute, private productservice: ProductserviceService,
              private router: Router, private snackbar: MatSnackBar) { }
  public ngOnInit() {
    this.sesuser = sessionStorage.getItem("loginid");
    this.actroute.params.subscribe((success) => {
      this.orderid = success.id; },
      (err) => {this.errormessage = err; },

    );
    this.productservice.getproductdetails(this.orderid).subscribe(
      (success) => {this.productdetails = success[0];
                    if (this.productdetails.pSeller.pQuantity <= 0) {
                          this.isavailable = false;
                    }},
      (err) => {this.errormessage = err; },
    );
  }

public buy() {
  this.router.navigate(["/buyorder", this.orderid]);
}

public logof() {
  sessionStorage.clear();
  this.router.navigate(["/login"]);
}

public dialog() {
  this.snackbar.open(" You will be notified when product arrives", "OK", {duration: 2000});
}
}
