import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BuyOrderComponent } from "./components/buy-order/buy-order.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { LoginComponent } from "./components/login/login.component";
import { ProductsComponent } from "./components/products/products.component";
import { ViewordersComponent } from "./components/vieworders/vieworders.component";
import { RegisterComponent } from './components/register/register.component';
import { MaterialModule } from "./helpers/material.module";
import { ProductListComponent } from './components/product-list/product-list.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { SellerOrdersComponent } from './components/seller-orders/seller-orders.component';
import { SafeUrlPipe } from "./helpers/safeUrl.pipe";
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ProductsComponent,
    BuyOrderComponent,
    ViewordersComponent,
    RegisterComponent,
    ProductListComponent,
    AddProductComponent,
    InventoryComponent,
    SellerOrdersComponent,
    SafeUrlPipe,
    CartComponent,
    CheckoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
