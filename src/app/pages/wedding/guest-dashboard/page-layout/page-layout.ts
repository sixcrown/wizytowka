import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth';
import { NavBarComponent } from '../nav-bar/nav-bar';
import { WeddingFooterComponent } from '../wedding-footer/wedding-footer';

@Component({
  selector: 'app-page-layout',
  imports: [NavBarComponent, WeddingFooterComponent],
  template: `
    <div class="page-layout">
      <app-nav-bar (logoutClicked)="logout()" />
      <main class="page-content">
        <ng-content></ng-content>
      </main>
      <app-wedding-footer />
    </div>
  `,
  styles: [`
    @use '../variables' as *;

    .page-layout {
      min-height: 100vh;
      background-color: $cream;
      font-family: $font-sans;
      color: $charcoal;
    }

    .page-content {
      padding-top: 80px;
    }
  `],
})
export class PageLayoutComponent {
  constructor(private authService: AuthService) {}

  async logout() {
    await this.authService.signOut();
  }
}
