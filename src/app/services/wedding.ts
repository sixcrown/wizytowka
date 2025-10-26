import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface RSVPResponse {
  id?: string;
  guest_id: string;
  attending: boolean;
  guests_count: number;
  needs_accommodation: boolean;
  dietary_restrictions?: string;
  message?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

@Injectable({
  providedIn: 'root',
})
export class WeddingService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );
  }

  // RSVP Methods
  async submitRSVP(rsvp: RSVPResponse) {
    const { data, error } = await this.supabase
      .from('rsvp_responses')
      .upsert({
        ...rsvp,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'guest_id'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getRSVP(guestId: string) {
    const { data, error } = await this.supabase
      .from('rsvp_responses')
      .select('*')
      .eq('guest_id', guestId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // Ignore not found error
    return data as RSVPResponse | null;
  }

  // FAQ Methods
  async getFAQs() {
    const { data, error } = await this.supabase
      .from('faqs')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;
    return data as FAQItem[];
  }

  async addFAQ(faq: Omit<FAQItem, 'id'>) {
    const { data, error } = await this.supabase
      .from('faqs')
      .insert(faq)
      .select()
      .single();

    if (error) throw error;
    return data as FAQItem;
  }
}
