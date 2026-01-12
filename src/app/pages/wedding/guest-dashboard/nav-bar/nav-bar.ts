import { Component, output, signal, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
  encapsulation: ViewEncapsulation.None,
})
export class NavBarComponent {
  logoutClicked = output<void>();
  mobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  onLogout() {
    this.closeMobileMenu();
    this.logoutClicked.emit();
  }
}
