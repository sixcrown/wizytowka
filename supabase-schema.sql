-- ============================================
-- Schemat Bazy Danych dla Aplikacji Weselnej
-- ============================================

-- Tabela gości
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela odpowiedzi RSVP
CREATE TABLE IF NOT EXISTS rsvp_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  attending BOOLEAN NOT NULL,
  guests_count INTEGER NOT NULL DEFAULT 1,
  needs_accommodation BOOLEAN DEFAULT FALSE,
  dietary_restrictions TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(guest_id)
);

-- Tabela FAQ
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Włącz RLS dla tabel
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Policy dla guests - tylko odczyt
CREATE POLICY "Guests are viewable by authenticated users"
  ON guests FOR SELECT
  TO authenticated
  USING (true);

-- Policy dla rsvp_responses - odczyt i zapis własnych danych
CREATE POLICY "Users can view their own RSVP"
  ON rsvp_responses FOR SELECT
  TO authenticated
  USING (auth.uid() = guest_id);

CREATE POLICY "Users can insert their own RSVP"
  ON rsvp_responses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = guest_id);

CREATE POLICY "Users can update their own RSVP"
  ON rsvp_responses FOR UPDATE
  TO authenticated
  USING (auth.uid() = guest_id);

-- Policy dla faqs - tylko odczyt dla wszystkich
CREATE POLICY "FAQs are viewable by everyone"
  ON faqs FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- Przykładowe Dane
-- ============================================

-- Dodaj przykładowe FAQ
INSERT INTO faqs (question, answer, "order") VALUES
  ('O której godzinie zaczyna się ceremonia?', 'Ceremonia rozpoczyna się o 15:00.', 1),
  ('Gdzie odbędzie się wesele?', 'Wesele odbędzie się w Hotelu Przykładowy, ul. Weselna 1, Warszawa.', 2),
  ('Czy są dostępne miejsca parkingowe?', 'Tak, hotel posiada bezpłatny parking dla gości.', 3),
  ('Do kiedy muszę potwierdzić obecność?', 'Prosimy o potwierdzenie do 30 dni przed ślubem.', 4),
  ('Czy mogę zabrać dzieci?', 'Tak, dzieci są mile widziane!', 5),
  ('Jaki jest dress code?', 'Elegancki strój wizytowy.', 6)
ON CONFLICT DO NOTHING;

-- Dodaj przykładowego gościa do testów
INSERT INTO guests (email, full_name, invite_code) VALUES
  ('gosc@example.com', 'Jan Kowalski', 'ABC123'),
  ('gosc2@example.com', 'Anna Nowak', 'XYZ789')
ON CONFLICT DO NOTHING;

-- ============================================
-- Funkcje Pomocnicze
-- ============================================

-- Funkcja do automatycznego update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger dla automatycznego update updated_at w rsvp_responses
CREATE TRIGGER update_rsvp_responses_updated_at
  BEFORE UPDATE ON rsvp_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
