import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/helpers/auth.service";
import { CategoryService } from "src/app/helpers/category.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {

  constructor(private authService: AuthService,private categoryService: CategoryService) { }
  
  userType: String;
  selectedCategory: string | null;
  activeSection: string = 'seller-dashboard';

  ngOnInit() {
    this.userType = this.authService.getUserRole();
    this.categoryService.selectedCategory$.subscribe((category) => {
      this.selectedCategory = category;
    });
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
  }
}

