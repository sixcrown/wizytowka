import { Component, OnInit, signal, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { WeddingService, WeddingPhoto } from '../../../services/wedding';
import { LoginComponent } from '../login/login';

@Component({
  selector: 'app-photo-gallery',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    RouterLink,
    LoginComponent,
  ],
  templateUrl: './photo-gallery.html',
  styleUrl: './photo-gallery.scss',
})
export class PhotoGalleryComponent implements OnInit {
  photos = signal<WeddingPhoto[]>([]);
  uploadingPhotos = signal<{ name: string; progress: number }[]>([]);
  isDragging = signal(false);
  lightboxPhoto = signal<WeddingPhoto | null>(null);
  loading = signal(true);
  isAuthenticated = computed(() => this.authService.isAuthenticated);

  // Podział na moje i inne zdjęcia
  myPhotos = computed(() => {
    const guestId = this.authService.currentGuest()?.id;
    return this.photos().filter((p) => p.guest_id === guestId);
  });

  otherPhotos = computed(() => {
    const guestId = this.authService.currentGuest()?.id;
    return this.photos().filter((p) => p.guest_id !== guestId);
  });

  constructor(
    public authService: AuthService,
    private weddingService: WeddingService,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    await this.loadPhotos();
  }

  async loadPhotos() {
    this.loading.set(true);
    try {
      const photos = await this.weddingService.getPhotos();
      this.photos.set(photos);
    } catch (error) {
      console.error('Error loading photos:', error);
      this.snackBar.open('Nie udało się załadować zdjęć', 'Zamknij', {
        duration: 3000,
      });
    } finally {
      this.loading.set(false);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  async onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files) {
      await this.uploadFiles(Array.from(files));
    }
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      await this.uploadFiles(Array.from(input.files));
      input.value = '';
    }
  }

  private async uploadFiles(files: File[]) {
    const guestId = this.authService.currentGuest()?.id;
    if (!guestId) {
      this.snackBar.open('Musisz być zalogowany aby dodać zdjęcia', 'Zamknij', {
        duration: 3000,
      });
      return;
    }

    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    const maxSize = 10 * 1024 * 1024; // 10MB

    for (const file of imageFiles) {
      if (file.size > maxSize) {
        this.snackBar.open(`${file.name} jest za duży (max 10MB)`, 'Zamknij', {
          duration: 3000,
        });
        continue;
      }

      this.uploadingPhotos.update((uploads) => [...uploads, { name: file.name, progress: 0 }]);

      try {
        await this.weddingService.uploadPhoto(file, guestId);
        this.snackBar.open(`${file.name} dodane!`, 'Zamknij', {
          duration: 2000,
        });
      } catch (error: any) {
        console.error('Upload error:', error);
        this.snackBar.open(`Błąd przy dodawaniu ${file.name}`, 'Zamknij', { duration: 3000 });
      } finally {
        this.uploadingPhotos.update((uploads) => uploads.filter((u) => u.name !== file.name));
      }
    }

    await this.loadPhotos();
  }

  async deletePhoto(photo: WeddingPhoto, event: Event) {
    event.stopPropagation();

    if (!confirm('Czy na pewno chcesz usunąć to zdjęcie?')) {
      return;
    }

    try {
      await this.weddingService.deletePhoto(photo.id, photo.file_path);
      this.photos.update((photos) => photos.filter((p) => p.id !== photo.id));
      this.snackBar.open('Zdjęcie usunięte', 'Zamknij', { duration: 2000 });
    } catch (error) {
      console.error('Delete error:', error);
      this.snackBar.open('Nie udało się usunąć zdjęcia', 'Zamknij', {
        duration: 3000,
      });
    }
  }

  openLightbox(photo: WeddingPhoto) {
    this.lightboxPhoto.set(photo);
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.lightboxPhoto.set(null);
    document.body.style.overflow = '';
  }

  navigateLightbox(direction: 'prev' | 'next', event: Event) {
    event.stopPropagation();
    const currentPhoto = this.lightboxPhoto();
    if (!currentPhoto) return;

    const currentIndex = this.photos().findIndex((p) => p.id === currentPhoto.id);
    let newIndex: number;

    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : this.photos().length - 1;
    } else {
      newIndex = currentIndex < this.photos().length - 1 ? currentIndex + 1 : 0;
    }

    this.lightboxPhoto.set(this.photos()[newIndex]);
  }
}
