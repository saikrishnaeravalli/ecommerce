import { Component, OnInit } from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { DashboardserviceService } from "./dashboardservice.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
public sesuser: any;
  public isproduct: boolean = false;
  public productdetails: any;
  public errormessage: any;
  public details: any;
  public isavailable: boolean = true;

  constructor(private dashboardservice: DashboardserviceService,
              private router: Router, private snackbar: MatSnackBar) { }
  public ngOnInit() {
    this.sesuser = sessionStorage.getItem("loginid");
    this.dashboardservice.search().subscribe((success) => {this.details = success; });
    this.product('Electronics')
  }
    public product(input) {
    this.isproduct = true;
    this.dashboardservice.product(input).subscribe(
      (data) => {this.productdetails = data; },
      (error) => this.errormessage = error,
    );
  }
  public productpage(input) {

    this.router.navigate(["/products", input]);
  }
  public buy(data) {
    this.router.navigate(["/buyorder", data]);
  }
  public logof() {
    sessionStorage.clear();
    this.router.navigate(["/login"]);
  }
  public search(input) {
    if (input.length === 0) {
      this.isproduct = false;
     } else { input = input.toLowerCase();
              this.productdetails = [];
              (this.details).forEach((element) => {
                  if (((element.pName).toLowerCase()).match((new RegExp(input)))) {
                  this.productdetails.push(element);
                  }
                });
              this.isproduct = true;
            }
  }
public dialog() {
    this.snackbar.open(" You will be notified when product arrives", "OK", {duration: 2000});
}

some(parameter){
  if (parameter == "home"){
    return "HOME PAGE"
  }
  else if (parameter == "news"){
    return "NEWS PAGE"
  }
  else if (parameter == "contact"){
    return "CONTACT PAGE"
  }else if (parameter == "about"){
    return "ABOUT PAGE"
  }
}
}

