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

export interface WeddingTable {
  id: string;
  table_number: number;
  table_name: string;
  capacity: number;
  position_x: number;
  position_y: number;
  is_bride_groom: boolean;
}

export interface TableAssignment {
  table_id: string;
  table_number: number;
  table_name: string;
  capacity: number;
  position_x: number;
  position_y: number;
  is_bride_groom: boolean;
  guest_id: string | null;
  guest_name: string | null;
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

  // Table Methods
  async getTables() {
    const { data, error } = await this.supabase
      .from('wedding_tables')
      .select('*')
      .order('table_number', { ascending: true });

    if (error) throw error;
    return data as WeddingTable[];
  }

  async getTableAssignments() {
    const { data, error } = await this.supabase
      .from('table_assignments')
      .select('*');

    if (error) throw error;
    return data as TableAssignment[];
  }

  async getGuestTable(guestId: string): Promise<WeddingTable | null> {
    const { data, error } = await this.supabase
      .from('guests')
      .select('table_id, wedding_tables(*)')
      .eq('id', guestId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    // wedding_tables returns as object when using foreign key relation with .single()
    return (data?.wedding_tables as unknown as WeddingTable) ?? null;
  }
}
