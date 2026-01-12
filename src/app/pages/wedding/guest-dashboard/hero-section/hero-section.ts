import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-hero-section',
  imports: [RouterLink],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSectionComponent {
  countdown = input.required<CountdownTime>();
}
