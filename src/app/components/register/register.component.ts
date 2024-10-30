import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  constructor(private authService: AuthService) {}
  register = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  onRegister() {
    console.log('Register:', this.register);
    try {
      this.authService.signUp(this.register.email, this.register.password);
    } catch (error) {
      console.error('Error registering:', error);
    }
  }
}
