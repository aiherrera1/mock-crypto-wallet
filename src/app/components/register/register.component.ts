import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  register = {
    email: '',
    password: '',
    confirmPassword: '',
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
  async onRegister() {
    this.errorMessage = null;

    // Validation checks
    if (!this.validateEmail(this.register.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }
    if (this.register.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }
    if (this.register.password !== this.register.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    // Attempt to sign up
    try {
      await this.authService.signUp(
        this.register.email,
        this.register.password,
      );
      this.router.navigate(['/']);
    } catch (error: any) {
      // Use `any` here to avoid TS18046
      if (error.message && error.message.includes('already-in-use')) {
        this.errorMessage = 'An account with this email already exists.';
      } else {
        this.errorMessage = 'Error during registration. Please try again.';
      }
      console.error('Error registering:', error);
    }
  }
}
