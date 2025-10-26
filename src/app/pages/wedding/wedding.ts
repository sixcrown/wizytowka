import { Component, computed } from '@angular/core';
import { AuthService } from '../../services/auth';
import { LoginComponent } from './login/login';
import { GuestDashboardComponent } from './guest-dashboard/guest-dashboard';

@Component({
  selector: 'app-wedding',
  imports: [LoginComponent, GuestDashboardComponent],
  templateUrl: './wedding.html',
  styleUrl: './wedding.scss',
})
export class WeddingComponent {
  isAuthenticated = computed(() => this.authService.isAuthenticated);

  constructor(public authService: AuthService) {}
}
