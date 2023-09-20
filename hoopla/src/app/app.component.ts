import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
 public title = "hoopla";

 vaiable_name ="HOME PAGE"

 some(parameter){
  if (parameter == "home"){
    this.vaiable_name = "HOME PAGE"
  }
  else if (parameter == "news"){
    this.vaiable_name = "NEWS PAGE"
  }
  else if (parameter == "contact"){
    this.vaiable_name = "CONTACT PAGE"
  }else if (parameter == "about"){
    this.vaiable_name = "ABOUT PAGE"
  }
}
 
}
