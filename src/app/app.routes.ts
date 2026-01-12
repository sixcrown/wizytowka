import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'slub',
    loadComponent: () =>
      import('./pages/wedding/wedding').then((m) => m.WeddingComponent),
  },
  {
    path: 'slub/harmonogram',
    loadComponent: () =>
      import('./pages/wedding/timeline-page/timeline-page').then(
        (m) => m.TimelinePageComponent
      ),
  },
  {
    path: 'slub/lokalizacja',
    loadComponent: () =>
      import('./pages/wedding/location-page/location-page').then(
        (m) => m.LocationPageComponent
      ),
  },
  {
    path: 'slub/rsvp',
    loadComponent: () =>
      import('./pages/wedding/rsvp-page/rsvp-page').then(
        (m) => m.RsvpPageComponent
      ),
  },
  {
    path: 'slub/stolik',
    loadComponent: () =>
      import('./pages/wedding/seating-page/seating-page').then(
        (m) => m.SeatingPageComponent
      ),
  },
  {
    path: 'slub/faq',
    loadComponent: () =>
      import('./pages/wedding/faq-page/faq-page').then(
        (m) => m.FaqPageComponent
      ),
  },
  {
    path: 'slub/galeria',
    loadComponent: () =>
      import('./pages/wedding/photo-gallery/photo-gallery').then(
        (m) => m.PhotoGalleryComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
