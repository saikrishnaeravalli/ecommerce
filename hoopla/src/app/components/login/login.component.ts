import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/helpers/auth.service";
import { LoginService } from "src/app/services/login.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public loginErrorMessage: string;
  public msg: any;
  constructor(private service: LoginService, private formBuilder: FormBuilder, private authService: AuthService, private route: Router) { }

  public ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required]]
    });
  }

  public onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      this.service.login(formData).subscribe(
        (res) => {
          if (res && res.token && res.expiresIn) {
            // Store the token and its expiration using AuthService
            console.log(res.token, res.expiresIn)
            this.authService.setAuthToken(res.token, res.expiresIn, res.userId);
            this.authService.setUserRole(res.role);
            // Clear any previous login error message
            this.loginErrorMessage = '';
            this.route.navigate(['/dashboard']);
          }
        },
        (err) => {
          this.loginErrorMessage = err;
        }
      )
    }
  }
}
