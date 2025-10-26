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
    // This is a simplified version - you'll need to implement
    // your own invite code logic in Supabase
    const { data, error } = await this.supabase
      .from('guests')
      .select('*')
      .eq('invite_code', inviteCode)
      .single();

    if (error) throw error;

    // Here you would create a session or sign in the user
    // This is a placeholder - implement based on your needs
    return data;
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
