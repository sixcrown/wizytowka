import { Component } from '@angular/core';
import { PageLayoutComponent } from '../guest-dashboard/page-layout/page-layout';
import { TimelineSectionComponent } from '../guest-dashboard/timeline-section/timeline-section';

@Component({
  selector: 'app-timeline-page',
  imports: [PageLayoutComponent, TimelineSectionComponent],
  template: `
    <app-page-layout>
      <app-timeline-section />
    </app-page-layout>
  `,
})
export class TimelinePageComponent {}
