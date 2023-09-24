import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar
import { AuthService } from 'src/app/helpers/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  selectedFiles: File[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private snackBar: MatSnackBar, // Inject MatSnackBar
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
      description: ['', Validators.required],
      stock: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      category: ['', Validators.required],
      images: [''],
    });
  }

  onFileSelect(event): void {
    const files: FileList = event.target.files as FileList;
    if (files.length > 0) {
      this.selectedFiles.push(...Array.from(files));
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  onSubmit(): void {
    if (this.productForm.valid && this.selectedFiles.length > 0) {
      this.isLoading = true;

      // Get the user ID from AuthService
      const userId = this.authService.getUserId();

      if (userId) {
        // Add the user ID to the productForm
        this.productForm.value["seller"] = userId;

        this.productService.saveProduct(this.productForm.value, this.selectedFiles)
          .then(product => {

            // Show success notification
            this.snackBar.open('Product added successfully!', 'Close', {
              duration: 3000,
            });

            // Reset the form and selectedFiles array
            this.productForm.reset();
            this.selectedFiles = [];
          })
          .catch(error => {
            console.error('Error adding product:', error);

            // Show error notification
            this.snackBar.open('Error adding product!', 'Close', {
              duration: 3000,
            });
          })
          .finally(() => {
            this.isLoading = false;
          });
      } else {
        console.error('User ID not found.'); // Handle the case when user ID is not available
        this.isLoading = false;
      }
    }
  }

}
