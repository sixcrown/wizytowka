import { Component } from '@angular/core';
import { PageLayoutComponent } from '../guest-dashboard/page-layout/page-layout';
import { LocationSectionComponent } from '../guest-dashboard/location-section/location-section';

@Component({
  selector: 'app-location-page',
  imports: [PageLayoutComponent, LocationSectionComponent],
  template: `
    <app-page-layout>
      <app-location-section />
    </app-page-layout>
  `,
})
export class LocationPageComponent {}
