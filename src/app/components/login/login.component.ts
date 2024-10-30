import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private authService: AuthService) {}
  login = {
    email: '',
    password: '',
  };

  async onLogin() {
    console.log('Login:', this.login);
    try {
      await this.authService.signIn(this.login.email, this.login.password);
      console.log('User logged in');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  }
}
