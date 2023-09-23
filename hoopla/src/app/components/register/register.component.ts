import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registrationForm: FormGroup;
  registrationSuccessMessage: string = '';
  registrationErrorMessage: string = '';

  constructor(private fb: FormBuilder, private service: RegisterService) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,20}$/)]],
      confirmPassword: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const formData = this.registrationForm.value;
      this.service.register(formData).subscribe(
        (res) => {
          this.registrationSuccessMessage = res.msg;
          this.registrationErrorMessage = '';
        },
        (err) => {
          this.registrationSuccessMessage = '';
          this.registrationErrorMessage = err;
        }
      )
    }
  }
}
