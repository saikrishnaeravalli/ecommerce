import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import {HttpClientModule} from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatToolbarModule} from "@angular/material/toolbar";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BuyOrderComponent } from "./buy-order/buy-order.component";
import { BuyService } from "./buy-order/buy.service";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { DashboardserviceService } from "./dashboard/dashboardservice.service";
import { LoginComponent } from "./login/login.component";
import { LoginserviceService } from "./login/loginservice.service";
import { ProductsComponent } from "./products/products.component";
import { ProductserviceService } from "./products/productservice.service";
import { ViewService } from "./vieworders/view.service";
import { ViewordersComponent } from "./vieworders/vieworders.component";
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ProductsComponent,
    BuyOrderComponent,
    ViewordersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatIconModule,
    MatSelectModule
  ],
  providers: [LoginserviceService, DashboardserviceService, ProductserviceService, BuyService, ViewService],
  bootstrap: [AppComponent],
})
export class AppModule { }
