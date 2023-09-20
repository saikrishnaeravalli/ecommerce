import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {Router} from "@angular/router";

import { Observable } from "rxjs";
import {LoginserviceService} from "./loginservice.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {

  public LoginForm: FormGroup;
  public logindetails: any;
  public errormessage: string;
  public msg: any;
  constructor(private router: Router, private loginservice: LoginserviceService, private formBuilder: FormBuilder) { }

  public ngOnInit() {
    this.LoginForm = this.formBuilder.group({
      Username: ["", [Validators.required, Validators.pattern("^[A-z]+@abc.com$")]],
      Password: ["", [ Validators.required,
      Validators.pattern("^(?=.*[A-Z])(?=.*[!@#$*])(?=.*[0-9])(?=.*[a-z]).{7,20}$")]]});
  }

public getCustomer() {
  this.loginservice.getCustomer(this.LoginForm.value).subscribe(
    (data) => {this.logindetails = data;
               if (this.logindetails === null) {
                  this.msg = "Invalid credentials";
                } else {
                      sessionStorage.setItem("loginid", this.logindetails.Username);
                      this.router.navigate(["/dashboard"]);
                }
            },
    (error) => this.errormessage = error as any);
}

}
