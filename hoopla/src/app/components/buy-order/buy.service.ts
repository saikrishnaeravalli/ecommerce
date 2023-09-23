import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BuyService {
private url = "http://localhost:1150/buy";
  constructor(private http: HttpClient) { }
public getorderdetails(prodid, user): Observable<any> {
  prodid = {prodid, username: user};
  return this.http.post(this.url, prodid);
}

}
