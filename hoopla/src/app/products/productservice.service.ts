import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProductserviceService {
private url = "http://localhost:1150/productdetails";
  constructor(private http: HttpClient) { }
  public getproductdetails(data): Observable<any> {
    data = {orderid: data};
    return this.http.post(this.url, data);
  }
}
