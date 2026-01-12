import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth';
import { WeddingService, RSVPResponse, FAQItem, WeddingTable } from '../../../services/wedding';
import { NavBarComponent } from './nav-bar/nav-bar';
import { HeroSectionComponent, CountdownTime } from './hero-section/hero-section';
import { WelcomeSectionComponent } from './welcome-section/welcome-section';
import { TimelineSectionComponent } from './timeline-section/timeline-section';
import { SeatingSectionComponent } from './seating-section/seating-section';
import { LocationSectionComponent } from './location-section/location-section';
import { RsvpSectionComponent } from './rsvp-section/rsvp-section';
import { GalleryPromoSectionComponent } from './gallery-promo-section/gallery-promo-section';
import { FaqSectionComponent } from './faq-section/faq-section';
import { WeddingFooterComponent } from './wedding-footer/wedding-footer';

@Component({
  selector: 'app-guest-dashboard',
  imports: [
    MatSnackBarModule,
    NavBarComponent,
    HeroSectionComponent,
    WelcomeSectionComponent,
    TimelineSectionComponent,
    SeatingSectionComponent,
    LocationSectionComponent,
    RsvpSectionComponent,
    GalleryPromoSectionComponent,
    FaqSectionComponent,
    WeddingFooterComponent,
  ],
  templateUrl: './guest-dashboard.html',
  styleUrl: './guest-dashboard.scss',
})
export class GuestDashboardComponent implements OnInit, OnDestroy {
  private countdownInterval: any;
  private readonly weddingDate = new Date('2026-08-02T14:00:00');

  rsvpForm = new FormGroup({
    attending: new FormControl<boolean>(true, [Validators.required]),
    guestsCount: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
    needsAccommodation: new FormControl<boolean>(false),
    dietaryRestrictions: new FormControl<string>(''),
    message: new FormControl<string>(''),
  });

  loading = signal(false);
  faqs = signal<FAQItem[]>([]);
  rsvpSubmitted = signal(false);
  countdown = signal<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  tables = signal<WeddingTable[]>([]);
  guestTable = signal<WeddingTable | null>(null);

  constructor(
    public authService: AuthService,
    private weddingService: WeddingService,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    this.startCountdown();
    await this.loadFAQs();
    await this.loadRSVP();
    await this.loadTables();
    await this.loadGuestTable();
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

  async loadFAQs() {
    try {
      const faqs = await this.weddingService.getFAQs();
      this.faqs.set(faqs);
    } catch (error) {
      console.error('Error loading FAQs:', error);
    }
  }

  async loadRSVP() {
    const guestId = this.authService.currentGuest()?.id;
    if (!guestId) return;

    try {
      const rsvp = await this.weddingService.getRSVP(guestId);
      if (rsvp) {
        this.rsvpForm.patchValue({
          attending: rsvp.attending,
          guestsCount: rsvp.guests_count,
          needsAccommodation: rsvp.needs_accommodation,
          dietaryRestrictions: rsvp.dietary_restrictions || '',
          message: rsvp.message || '',
        });
        this.rsvpSubmitted.set(true);
      }
    } catch (error) {
      console.error('Error loading RSVP:', error);
    }
  }

  async onSubmitRSVP() {
    if (this.rsvpForm.invalid) return;

    const guestId = this.authService.currentGuest()?.id;
    if (!guestId) return;

    this.loading.set(true);

    try {
      const rsvp: RSVPResponse = {
        guest_id: guestId,
        attending: this.rsvpForm.value.attending!,
        guests_count: this.rsvpForm.value.guestsCount!,
        needs_accommodation: this.rsvpForm.value.needsAccommodation!,
        dietary_restrictions: this.rsvpForm.value.dietaryRestrictions || undefined,
        message: this.rsvpForm.value.message || undefined,
      };

      await this.weddingService.submitRSVP(rsvp);
      this.rsvpSubmitted.set(true);
      this.snackBar.open('Twoja odpowiedź została zapisana!', 'Zamknij', {
        duration: 3000,
      });
    } catch (error: any) {
      this.snackBar.open(error.message || 'Wystąpił błąd', 'Zamknij', {
        duration: 3000,
      });
    } finally {
      this.loading.set(false);
    }
  }

  async logout() {
    await this.authService.signOut();
  }

  async loadTables() {
    try {
      const tables = await this.weddingService.getTables();
      this.tables.set(tables);
    } catch (error) {
      console.error('Error loading tables:', error);
    }
  }

  async loadGuestTable() {
    const guestId = this.authService.currentGuest()?.id;
    if (!guestId) return;

    try {
      const table = await this.weddingService.getGuestTable(guestId);
      this.guestTable.set(table);
    } catch (error) {
      console.error('Error loading guest table:', error);
    }
  }
}
