import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ViewService } from "./view.service";

@Component({
  selector: "app-vieworders",
  templateUrl: "./vieworders.component.html",
  styleUrls: ["./vieworders.component.css"],
})
export class ViewordersComponent implements OnInit {
public sesuser: any;
public vieworder: any;

  constructor(private view: ViewService, private router: Router) { }
  public ngOnInit() {
    this.sesuser = sessionStorage.getItem("loginid");
    this.view.vieworders(this.sesuser).subscribe(
      (success) => {this.vieworder = success[0].Orders;
                     });
  }
  public logof() {
    sessionStorage.clear();
    this.router.navigate(["/login"]);
  }

}
