import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';
import { AuthService } from './services/auth.service';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
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
    this.authService.logout().catch((error) => {
      console.error('Error logging out:', error);
    });
    this.isLoggedIn = false;
    this.user = null;
    this.router.navigate(['/']);
  }
}
