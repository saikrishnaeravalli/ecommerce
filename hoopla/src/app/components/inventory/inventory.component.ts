import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/helpers/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: string[] = [];
  displayedColumns: string[] = ['name', 'dateCreated', 'price', 'stock'];
  userId: string;

  filterForm: FormGroup;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource: MatTableDataSource<any>;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.filterForm = this.fb.group({
      category: ['All'],
    });
  }

  ngOnInit(): void {
    this.snackBar.open(
      'This page can only be used to update stock. If you want to edit anything else, go to the Products page.',
      'Got it',
      {
        duration: 10000, // Adjust the duration as needed
        horizontalPosition: 'center', // Position at the start of the screen
        verticalPosition: 'top', // Position at the top
        panelClass: ['info-notification'], // Apply custom CSS class for styling
      }
    );
    this.productService.getInventory(this.authService.getUserId()).subscribe((data: any[]) => {
      this.products = data;
      this.filteredProducts = [...this.products];
      this.categories = this.getUniqueCategories(this.products);

      this.filteredProducts.sort((a, b) => (a.name > b.name ? 1 : -1));

      this.dataSource = new MatTableDataSource(this.filteredProducts);
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(): void {
    const selectedCategory = this.filterForm.get('category')!.value;

    if (selectedCategory === 'All') {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product => product.category === selectedCategory);
    }

    this.filteredProducts.sort((a, b) => (a.name > b.name ? 1 : -1));

    this.dataSource.data = this.filteredProducts;
  }

  getUniqueCategories(products: any[]): string[] {
    const uniqueCategories = Array.from(new Set(products.map(product => product.category)));
    return uniqueCategories;
  }

  // Function to start editing stock
  startEditing(product: any): void {
    product.editing = true;
    // Create a FormGroup for editing the stock
    product.stockForm = this.fb.group({
      stockValue: [product.stock, [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });
  }

  // Function to commit edited stock
  commitEdit(product: any): void {
    const stockValue = product.stockForm.get('stockValue').value;
    if (!product.stockForm.valid) {
      // Handle form validation errors
      return;
    }

    const newStock = parseInt(stockValue, 10);
    if (!isNaN(newStock)) {
      product.stock = newStock;
      this.updateStockInBackend(product);
      product.editing = false;
    } else {
      // Handle invalid input, e.g., show an error message
    }
  }

  // Function to update stock in the backend
  updateStockInBackend(product: any): void {
    // Store the original stock value
    const originalStock = product.stock;

    // Call the ProductService to update the stock quantity
    this.productService.updateProductStock(product._id, product.stock)
      .subscribe(
        () => {
          // Stock update successful
          this.snackBar.open('Stock updated successfully!', 'Close', {
            duration: 3000,
          });
        },
        (error) => {
          // Stock update failed
          this.snackBar.open('Failed to update stock!', 'Close', {
            duration: 3000,
          });
        }
      )
      .add(() => {
        // Close the editing state and display the original stock value
        product.editing = false;
        product.stock = originalStock;
      });
  }

}
