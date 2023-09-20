import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ViewService {
private url = "http://localhost:1150/vieworders";
  constructor(private http: HttpClient) { }

  public vieworders(input): Observable<any> {
    input = {username: input};
    return this.http.post(this.url, input);
  }

}
