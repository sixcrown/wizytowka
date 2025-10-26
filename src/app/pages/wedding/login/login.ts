import { Component, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  loginSuccess = output<void>();

  loginForm = new FormGroup({
    inviteCode: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private authService: AuthService) {}

  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    try {
      const inviteCode = this.loginForm.value.inviteCode!;
      await this.authService.signInWithInviteCode(inviteCode);
      this.loginSuccess.emit();
    } catch (err: any) {
      this.error.set(err.message || 'Nieprawidłowy kod zaproszenia');
    } finally {
      this.loading.set(false);
    }
  }
}
