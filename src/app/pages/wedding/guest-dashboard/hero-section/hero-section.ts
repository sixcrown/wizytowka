import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-hero-section',
  imports: [MatIconModule],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSectionComponent {
  countdown = input.required<CountdownTime>();
}
