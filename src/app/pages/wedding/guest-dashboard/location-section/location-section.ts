import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-location-section',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './location-section.html',
  styleUrl: './location-section.scss',
})
export class LocationSectionComponent {}
