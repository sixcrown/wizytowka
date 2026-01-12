import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-gallery-promo-section',
  imports: [RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './gallery-promo-section.html',
  styleUrl: './gallery-promo-section.scss',
})
export class GalleryPromoSectionComponent {}
