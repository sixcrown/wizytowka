import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { NavBarComponent } from './nav-bar/nav-bar';
import { HeroSectionComponent, CountdownTime } from './hero-section/hero-section';
import { WelcomeSectionComponent } from './welcome-section/welcome-section';
import { WeddingFooterComponent } from './wedding-footer/wedding-footer';

@Component({
  selector: 'app-guest-dashboard',
  imports: [
    NavBarComponent,
    HeroSectionComponent,
    WelcomeSectionComponent,
    WeddingFooterComponent,
  ],
  templateUrl: './guest-dashboard.html',
  styleUrl: './guest-dashboard.scss',
})
export class GuestDashboardComponent implements OnInit, OnDestroy {
  private countdownInterval: any;
  private readonly weddingDate = new Date('2026-08-02T14:00:00');

  countdown = signal<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.startCountdown();
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private startCountdown() {
    this.updateCountdown();
    this.countdownInterval = setInterval(() => this.updateCountdown(), 1000);
  }

  private updateCountdown() {
    const now = new Date().getTime();
    const distance = this.weddingDate.getTime() - now;

    if (distance < 0) {
      this.countdown.set({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.countdown.set({ days, hours, minutes, seconds });
  }

  async logout() {
    await this.authService.signOut();
  }
}
