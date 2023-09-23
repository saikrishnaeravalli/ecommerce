import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BuyOrderComponent } from "./components/buy-order/buy-order.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { LoginComponent } from "./components/login/login.component";
import { ProductsComponent } from "./components/products/products.component";
import { RegisterComponent } from "./components/register/register.component";
import { ViewordersComponent } from "./components/vieworders/vieworders.component";

const routes: Routes = [{ path: "", redirectTo: "/login", pathMatch: "full" },
{ path: "login", component: LoginComponent },
{ path: "register", component: RegisterComponent },
// {
//   path: 'seller',
//   component: SellerDashboardComponent,
//   children: [
//     { path: 'products', component: ProductListComponent },
//     { path: 'products/add', component: ProductFormComponent },
//     // Add more routes for other dashboard sections
//   ],
// },
{ path: "dashboard", component: DashboardComponent },
{ path: "products/:id", component: ProductsComponent },
{ path: "buyorder/:id", component: BuyOrderComponent },
{ path: "vieworders", component: ViewordersComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
