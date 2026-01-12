import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-rsvp-section',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: './rsvp-section.html',
  styleUrl: './rsvp-section.scss',
})
export class RsvpSectionComponent {
  rsvpForm = input.required<FormGroup>();
  loading = input<boolean>(false);
  rsvpSubmitted = input<boolean>(false);

  submitRsvp = output<void>();

  onSubmit() {
    this.submitRsvp.emit();
  }
}
