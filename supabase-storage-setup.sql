-- Supabase Storage Setup for Wedding Photos
-- ============================================

-- KROK 1: Utwórz bucket w Supabase Dashboard
-- Dashboard -> Storage -> New Bucket
-- Name: wedding-photos
-- Public: true (żeby można było wyświetlać zdjęcia)

-- KROK 2: Uruchom poniższy SQL w SQL Editor

-- Tabela metadanych zdjęć
CREATE TABLE IF NOT EXISTS wedding_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  caption TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Włącz RLS
ALTER TABLE wedding_photos ENABLE ROW LEVEL SECURITY;

-- Polityki dla tabeli wedding_photos
-- Wszyscy mogą oglądać zdjęcia
CREATE POLICY "Anyone can view photos" ON wedding_photos
  FOR SELECT USING (true);

-- Zalogowani goście mogą dodawać zdjęcia
CREATE POLICY "Authenticated users can upload photos" ON wedding_photos
  FOR INSERT WITH CHECK (true);

-- Goście mogą usuwać tylko swoje zdjęcia
CREATE POLICY "Users can delete own photos" ON wedding_photos
  FOR DELETE USING (guest_id::text = auth.uid()::text);

-- KROK 3: Ustaw polityki Storage w Dashboard
-- Dashboard -> Storage -> wedding-photos -> Policies
--
-- Policy 1: Allow public read
-- - Allowed operation: SELECT
-- - Target roles: (puste = wszyscy)
-- - Policy definition: true
--
-- Policy 2: Allow authenticated uploads
-- - Allowed operation: INSERT
-- - Target roles: authenticated
-- - Policy definition: true
--
-- Policy 3: Allow users to delete own files
-- - Allowed operation: DELETE
-- - Target roles: authenticated
-- - Policy definition: (bucket_id = 'wedding-photos')
