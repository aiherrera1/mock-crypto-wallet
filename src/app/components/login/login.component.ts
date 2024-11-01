import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  login = {
    email: '',
    password: '',
  };
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  async onLogin() {
    this.errorMessage = null;

    // Validate email format
    if (!this.validateEmail(this.login.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    // Check if password is entered
    if (this.login.password.trim() === '') {
      this.errorMessage = 'Please enter your password.';
      return;
    }

    // Attempt login
    try {
      await this.authService.signIn(this.login.email, this.login.password);
      this.router.navigate(['/']);
      console.log('User logged in');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        this.errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        this.errorMessage = 'Incorrect password. Please try again.';
      } else {
        this.errorMessage = 'Error logging in. Please try again later.';
      }
      console.error('Error logging in:', error);
    }
  }
}
