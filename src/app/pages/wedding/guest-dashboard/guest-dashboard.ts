import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { WeddingService, RSVPResponse, FAQItem, WeddingTable, WeddingPhoto } from '../../../services/wedding';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-guest-dashboard',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatToolbarModule,
    MatIconModule,
    MatSnackBarModule,
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

  getTablesRange(start: number, end: number): WeddingTable[] {
    return this.tables().filter((t) => t.table_number >= start && t.table_number <= end);
  }

  getTablePosition(tableNumber: number): { top: number; right: number } {
    const positions: Record<number, { top: number; right: number }> = {
      0: { top: 49, right: 1.5 }, // Państwo Młodzi - między stołem 3 a 4
      1: { top: 3, right: 3 },
      2: { top: 18, right: 3 },
      3: { top: 33, right: 3 },
      4: { top: 64, right: 3 },
      5: { top: 79, right: 3 },
      6: { top: 79, right: 12 },
      7: { top: 79, right: 21 },
    };
    return positions[tableNumber] || { top: 50, right: 50 };
  }

  getBrideGroomTable(): WeddingTable | undefined {
    return this.tables().find((t) => t.is_bride_groom);
  }
}
