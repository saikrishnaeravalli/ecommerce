import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  // Store the authentication token and its expiration
  setAuthToken(token: string, expiration: string, userId: string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authTokenExpiration', expiration);
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
    // Remove the role from local storage when logging out
    localStorage.removeItem('userRole');
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
