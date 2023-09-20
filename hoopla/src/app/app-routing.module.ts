import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { BuyOrderComponent } from "./buy-order/buy-order.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoginComponent } from "./login/login.component";
import { ProductsComponent } from "./products/products.component";
import { ViewordersComponent } from "./vieworders/vieworders.component";

const routes: Routes = [{path: "" , redirectTo: "/login", pathMatch: "full"},
  {path: "login", component: LoginComponent},
{path: "dashboard", component: DashboardComponent},
{path: "products/:id", component: ProductsComponent},
{path: "buyorder/:id", component: BuyOrderComponent},
{path: "vieworders", component: ViewordersComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
