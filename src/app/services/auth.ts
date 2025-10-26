import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface Guest {
  id: string;
  email: string;
  full_name: string;
  invite_code?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase: SupabaseClient;
  currentUser = signal<User | null>(null);
  currentGuest = signal<Guest | null>(null);

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );

    // Check for existing session
    this.supabase.auth.getSession().then(({ data: { session } }) => {
      this.currentUser.set(session?.user ?? null);
      if (session?.user) {
        this.loadGuestData(session.user.id);
      }
    });

    // Listen for auth changes
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.currentUser.set(session?.user ?? null);
      if (session?.user) {
        this.loadGuestData(session.user.id);
      } else {
        this.currentGuest.set(null);
      }
    });
  }

  async signInWithEmail(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signInWithInviteCode(inviteCode: string) {
    // Sprawdź czy kod zaproszenia istnieje
    const { data: guest, error: guestError } = await this.supabase
      .from('guests')
      .select('*')
      .eq('invite_code', inviteCode)
      .single();

    if (guestError) throw new Error('Nieprawidłowy kod zaproszenia');

    // Spróbuj zalogować używając email + invite_code jako hasła
    const { data: signInData, error: signInError } = await this.supabase.auth.signInWithPassword({
      email: guest.email,
      password: inviteCode,
    });

    // Jeśli logowanie nie powiodło się, utwórz nowe konto
    if (signInError) {
      const { data: signUpData, error: signUpError } = await this.supabase.auth.signUp({
        email: guest.email,
        password: inviteCode,
        options: {
          data: {
            full_name: guest.full_name,
            guest_id: guest.id,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Po utworzeniu konta, od razu zaloguj
      if (signUpData.user) {
        await this.loadGuestData(guest.id);
        return signUpData;
      }
    }

    // Jeśli logowanie się powiodło
    if (signInData.user) {
      await this.loadGuestData(guest.id);
      return signInData;
    }

    throw new Error('Nie udało się zalogować');
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    this.currentGuest.set(null);
  }

  private async loadGuestData(userId: string) {
    const { data, error } = await this.supabase
      .from('guests')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      this.currentGuest.set(data as Guest);
    }
  }

  get isAuthenticated() {
    return this.currentUser() !== null;
  }
}
