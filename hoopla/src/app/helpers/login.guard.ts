import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      // User is authenticated, allow access to the route
      return true;
    } else {
      // User is not authenticated, redirect to the login page
      this.router.navigate(['/login']);
      return false;
    }
  }

}
