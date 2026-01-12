import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageLayoutComponent } from '../guest-dashboard/page-layout/page-layout';
import { RsvpSectionComponent } from '../guest-dashboard/rsvp-section/rsvp-section';
import { WeddingService, RSVPResponse } from '../../../services/wedding';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-rsvp-page',
  imports: [PageLayoutComponent, RsvpSectionComponent, MatSnackBarModule],
  template: `
    <app-page-layout>
      <app-rsvp-section
        [rsvpForm]="rsvpForm"
        [loading]="loading()"
        [rsvpSubmitted]="rsvpSubmitted()"
        (submitRsvp)="onSubmitRSVP()"
      />
    </app-page-layout>
  `,
})
export class RsvpPageComponent implements OnInit {
  rsvpForm = new FormGroup({
    attending: new FormControl<boolean>(true, [Validators.required]),
    guestsCount: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
    needsAccommodation: new FormControl<boolean>(false),
    dietaryRestrictions: new FormControl<string>(''),
    message: new FormControl<string>(''),
  });

  loading = signal(false);
  rsvpSubmitted = signal(false);

  constructor(
    private weddingService: WeddingService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    await this.loadRSVP();
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
}
