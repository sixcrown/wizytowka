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
