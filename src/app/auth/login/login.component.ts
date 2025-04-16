import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl(),
    password: new FormControl()
  })

  constructor(private authService: AuthService) { console.log('LoginComponent loaded');}

  onSubmit(): void {
    const res = this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    });
    if (!res) {
      alert('Invalid email or password');
    }
  }
}
