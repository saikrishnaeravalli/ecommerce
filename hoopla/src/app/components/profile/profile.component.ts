import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/helpers/auth.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  userId: string;

  constructor(private formBuilder: FormBuilder, private service: ProfileService,
    private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    // Initialize the profile form with user data (fetch from backend)
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: [''],
      phoneno: [''],
      address: [''],
      zipcode: [''],
      // Add form controls for other profile properties
    });


    // Fetch user profile data from the backend using a service and patch it into the form
    this.service.getUser(this.userId).subscribe((userData) => {
      this.profileForm.patchValue(userData);
    });
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      // Send updated user profile data to the backend using a service
      this.service.updateUser(this.userId, this.profileForm.value).subscribe(
        () => {
          // Fetch user profile data from the backend using a service and patch it into the form
          this.service.getUser(this.userId).subscribe((userData) => {
            this.profileForm.patchValue(userData);
          });
        },
        (error) => {
          // Handle error
        }
      );
    }
  }

  cancelEdit(): void {
    this.router.navigate(["/dashboard"])
  }
}
