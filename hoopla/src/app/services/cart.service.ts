import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private api = environment.apiURL + '/api/';

  constructor(private http: HttpClient) { }

  addToCart(productId: string, userId: string): Observable<any> {
    const addToCartUrl = this.api + 'addToCart';
    const data = { productId, userId };

    return this.http.post<any>(addToCartUrl, data).pipe(
      catchError(this.handleError)
    );
  }

  getCartItems(userID: string): Observable<any[]> {
    return this.http.get<any[]>(this.api + 'cart/' + userID).pipe(
      catchError(this.handleError)
    );
  }

  updateCartItem(cartItemId: string, quantity: number): Observable<any> {
    const updateToCartUrl = this.api + 'cart';
    const updatedCartItem = {
      quantity
    };
    return this.http.put<any>(`${updateToCartUrl}/${cartItemId}`, updatedCartItem).pipe(
      catchError(this.handleError)
    );
  }

  removeCartItem(cartItemId: string): Observable<any> {
    const deleteFromCartUrl = this.api + 'cart';
    return this.http.delete<void>(`${deleteFromCartUrl}/${cartItemId}`).pipe(
      catchError(this.handleError)
    );
  }

  addOrder(orderData: any): Observable<any> {
    return this.http.post<any>(this.api + 'addOrder', orderData).pipe(
      catchError(this.handleError)
    )
  }

  clearCart(userId: string): Observable<any> {
    const clearCartUrl = this.api + 'clearCart/' + userId;
    return this.http.delete<void>(`${clearCartUrl}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse) {
    return throwError(err.error.msg || 'Server error');
  }
}
