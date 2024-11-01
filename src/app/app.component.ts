import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';
import { AuthService } from './services/auth.service';
import { User } from '@angular/fire/auth';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { CryptoService } from './services/crypto.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    DashboardComponent,
    HttpClientModule,
  ],
  providers: [CryptoService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'proyecto-neat-pagos';
  isLoggedIn: boolean = false;
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.authState$.subscribe(async (user) => {
      if (user) {
        this.isLoggedIn = true;
        this.user = user;
      } else {
        console.log('User logged out');
      }
    });
  }

  ngOnDestroy(): void {
    this.authService.authState$.subscribe().unsubscribe();
  }

  public handleLogout(): void {
    this.isLoggedIn = false;
    this.user = null;
    this.router.navigate(['/']);
    this.authService.logout().catch((error) => {
      console.error('Error logging out:', error);
    });
  }
}
