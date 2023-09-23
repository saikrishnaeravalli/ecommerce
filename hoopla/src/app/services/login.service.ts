import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  /**
   * This variable is used as a common url
   */
  api = environment.apiURL + '/api/'

  /**
   * This method acts as an interface between frontend and backend for registering a new user
   * @param userData This contains the details entered by the user for registration purposes
   * @returns 
   */
  login(userData: any): Observable<any> {
    return this.http.post<any>(this.api + 'login', userData).pipe(
      catchError(this.handleError));;
  }

  /**
  * This method is used to handle all the errors
  * @param err This is an Http error response
  * @returns 
  */
  private handleError(err: HttpErrorResponse) {
    return throwError(err.error.msg || 'Server error');
  }
}
