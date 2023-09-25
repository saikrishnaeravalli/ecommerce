import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ViewOrdersService {

  constructor(private http: HttpClient) { }

  /**
   * This variable is used as a common url
   */
  api = environment.apiURL + '/api/'

  // Get all orders
  getOrders(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}getOrders/${userId}`).pipe(
      catchError(this.handleError));
  }

  getOrderById(orderId: string): Observable<any> {
    const url = `${this.api}orders/${orderId}`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError));
  }

  getOrderBySeller(userId: string): Observable<any> {
    const url = `${this.api}sellerOrders/${userId}`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError));
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
