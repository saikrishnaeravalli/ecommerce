import {HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoginserviceService {
  public data: Observable<any>;
  public user: any;
private url = "http://localhost:1150/login";
  constructor(private http: HttpClient) { }
public getCustomer(inputdata: any): Observable<any> {
  this.data = this.http.post(this.url, inputdata);
  this.data.subscribe((success) => {this.user = success; });
  return this.data;

}

}
