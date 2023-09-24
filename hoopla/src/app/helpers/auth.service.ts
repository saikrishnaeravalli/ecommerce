import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) { }

  setAuthToken(token: string, expirationMinutes: number, userId: string): void {
    // Calculate the expiration date based on the current time and expirationMinutes
    const currentTime = new Date().getTime();
    const expirationTime = currentTime + expirationMinutes * 60 * 1000; // Convert minutes to milliseconds

    // Store the token and its expiration time
    localStorage.setItem('authToken', token);
    localStorage.setItem('authTokenExpiration', new Date(expirationTime).toISOString());
    localStorage.setItem('userId', userId);
  }

  // Get the authentication token from local storage
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Get the user ID from local storage
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    const expiration = localStorage.getItem('authTokenExpiration');

    if (!token || !expiration) {
      return false;
    }

    const currentTime = new Date().getTime();
    return currentTime < new Date(expiration).getTime();
  }

  // Clear authentication tokens and log the user out
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authTokenExpiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login'])
  }

  // Store the user's role in local storage
  setUserRole(role: string): void {
    localStorage.setItem('userRole', role);
  }

  // Get the user's role from local storage
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }
}
