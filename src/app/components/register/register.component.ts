import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}
  register = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  onRegister() {
    console.log('Register:', this.register);
    try {
      this.authService.signUp(this.register.email, this.register.password);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error registering:', error);
    }
  }
}
