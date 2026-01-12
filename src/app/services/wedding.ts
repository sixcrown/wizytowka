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

export interface WeddingPhoto {
  id: string;
  guest_id: string | null;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  caption?: string;
  uploaded_at: string;
  guest_name?: string;
  url?: string;
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

  // Photo Methods
  async uploadPhoto(file: File, guestId: string, caption?: string): Promise<WeddingPhoto> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${guestId}/${Date.now()}.${fileExt}`;

    // Upload file to storage
    const { error: uploadError } = await this.supabase.storage
      .from('wedding-photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Save metadata to database
    const { data, error: dbError } = await this.supabase
      .from('wedding_photos')
      .insert({
        guest_id: guestId,
        file_path: fileName,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        caption,
      })
      .select()
      .single();

    if (dbError) throw dbError;
    return data as WeddingPhoto;
  }

  async getPhotos(): Promise<WeddingPhoto[]> {
    const { data, error } = await this.supabase
      .from('wedding_photos')
      .select('*, guests(full_name)')
      .order('uploaded_at', { ascending: false });

    if (error) throw error;

    // Get public URLs for all photos
    const photosWithUrls = (data || []).map((photo: any) => {
      const { data: urlData } = this.supabase.storage
        .from('wedding-photos')
        .getPublicUrl(photo.file_path);

      return {
        ...photo,
        guest_name: photo.guests?.full_name,
        url: urlData.publicUrl,
      } as WeddingPhoto;
    });

    return photosWithUrls;
  }

  async deletePhoto(photoId: string, filePath: string): Promise<void> {
    // Delete from storage
    const { error: storageError } = await this.supabase.storage
      .from('wedding-photos')
      .remove([filePath]);

    if (storageError) throw storageError;

    // Delete from database
    const { error: dbError } = await this.supabase
      .from('wedding_photos')
      .delete()
      .eq('id', photoId);

    if (dbError) throw dbError;
  }

  getPhotoUrl(filePath: string): string {
    const { data } = this.supabase.storage
      .from('wedding-photos')
      .getPublicUrl(filePath);
    return data.publicUrl;
  }
}
