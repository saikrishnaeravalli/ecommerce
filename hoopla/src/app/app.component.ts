import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./helpers/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() { }

  // Check if a token exists in local storage using AuthService
  isTokenInLocalStorage(): boolean {
    return this.authService.isAuthenticated();
  }

  // Check if the current route is the /login page
  isOnLoginPage(): boolean {
    return this.router.url === '/login';
  }

  // Check if the current route is the /register page
  isOnRegisterPage(): boolean {
    return this.router.url === '/register';
  }

  // Implement logout logic using AuthService
  signOff(): void {
    // Call the logout method from AuthService
    this.authService.logout();

    // You can also add redirection logic if needed
  }
}
