import { Component, OnInit, signal } from '@angular/core';
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
import { WeddingService, RSVPResponse, FAQItem } from '../../../services/wedding';

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
export class GuestDashboardComponent implements OnInit {
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

  constructor(
    public authService: AuthService,
    private weddingService: WeddingService,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    await this.loadFAQs();
    await this.loadRSVP();
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
    const guestId = this.authService.currentUser()?.id;
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

    const guestId = this.authService.currentUser()?.id;
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
}
