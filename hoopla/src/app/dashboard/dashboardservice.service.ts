import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DashboardserviceService {
  private url = "http://localhost:1150/products";
  private url2 = "http://localhost:1150/searchall";
  constructor(private http: HttpClient) { }
  public product(inputdata: any): Observable<any> {
    inputdata = {category: inputdata};
    return this.http.post(this.url, inputdata);

  }
  public search(): Observable<any> {
    return this.http.get(this.url2);
  }
}
