import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CartComponent } from "./components/cart/cart.component";
import { CheckoutComponent } from "./components/checkout/checkout.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { LoginComponent } from "./components/login/login.component";
import { OrderPageComponent } from "./components/order-page/order-page.component";
import { ProductsComponent } from "./components/products/products.component";
import { RegisterComponent } from "./components/register/register.component";
import { ViewordersComponent } from "./components/vieworders/vieworders.component";
import { LoginGuard } from "./helpers/login.guard";

const routes: Routes = [{ path: "", redirectTo: "/login", pathMatch: "full" },
{ path: "login", component: LoginComponent },
{ path: "register", component: RegisterComponent },
{ path: "dashboard", component: DashboardComponent, canActivate: [LoginGuard] },
{ path: "cart", component: CartComponent, canActivate: [LoginGuard] },
{ path: "orders", component: ViewordersComponent, canActivate: [LoginGuard] },
{ path: "orders/:id", component: OrderPageComponent, canActivate: [LoginGuard] },
{ path: "checkout", component: CheckoutComponent, canActivate: [LoginGuard] },
{ path: "products/:id", component: ProductsComponent },
{ path: "vieworders", component: ViewordersComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
