import { Component, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, MatIconModule],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})
export class NavBarComponent {
  logoutClicked = output<void>();

  onLogout() {
    this.logoutClicked.emit();
  }
}
