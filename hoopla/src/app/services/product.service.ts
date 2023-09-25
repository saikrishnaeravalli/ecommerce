import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = environment.apiURL + '/api'; // Replace with your backend URL

  constructor(private http: HttpClient) { }

  // Get all products
  getProducts(category?: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/` + category).pipe(
      catchError(this.handleError));;;
  }

  // Get a product by ID
  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/products/${id}`).pipe(
      catchError(this.handleError));;;
  }

  getFirstImage(imageIds: string[]): Observable<Blob | string> {
    if (imageIds && imageIds.length > 0) {
      const url = `${this.baseUrl}/images/${imageIds[0]}`;
      return this.http.get(url, { responseType: 'blob' });
    }
    // Handle the case when there are no images, perhaps return a default image or an empty string
    return new Observable();
  }


  // Add a new product
  saveProduct(productData: any, images: File[]): Promise<any> {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      formData.append(key, productData[key]);
    });
    images.forEach((image) => {
      formData.append('images', image, image.name);
    });
    return this.http.post(`${this.baseUrl}/products`, formData).toPromise();
  }

  // Update a product by ID
  updateProduct(id: string, product: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/products/${id}`, product).pipe(
      catchError(this.handleError));;;
  }

  // Update the stock of a product by ID
  updateProductStock(productId: string, newStockQuantity: number): Observable<any> {
    const url = `${this.baseUrl}/updateStock/${productId}`;
    const requestBody = { stock: newStockQuantity };

    return this.http.put(url, requestBody).pipe(
      catchError(this.handleError)
    );
  }

  // Get all products
  getInventory(userID: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/inventory/${userID}`).pipe(
      catchError(this.handleError));;;
  }

  // Delete a product by ID
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/products/${id}`).pipe(
      catchError(this.handleError));;;
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
