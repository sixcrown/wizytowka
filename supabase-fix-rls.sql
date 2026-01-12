-- ============================================
-- Poprawione polityki RLS dla logowania przez invite_code
-- ============================================

-- Włącz z powrotem RLS
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Usuń wszystkie stare polityki
DROP POLICY IF EXISTS "Guests are viewable by authenticated users" ON guests;
DROP POLICY IF EXISTS "Guests are viewable by anyone" ON guests;
DROP POLICY IF EXISTS "Guests are readable by anyone with API key" ON guests;
DROP POLICY IF EXISTS "Users can view their own RSVP" ON rsvp_responses;
DROP POLICY IF EXISTS "Users can insert their own RSVP" ON rsvp_responses;
DROP POLICY IF EXISTS "Users can update their own RSVP" ON rsvp_responses;
DROP POLICY IF EXISTS "Users can delete their own RSVP" ON rsvp_responses;
DROP POLICY IF EXISTS "Anyone can view RSVP responses" ON rsvp_responses;
DROP POLICY IF EXISTS "Anyone can insert RSVP" ON rsvp_responses;
DROP POLICY IF EXISTS "Anyone can update RSVP" ON rsvp_responses;
DROP POLICY IF EXISTS "FAQs are viewable by everyone" ON faqs;
DROP POLICY IF EXISTS "FAQs are viewable by anyone" ON faqs;
DROP POLICY IF EXISTS "FAQs are readable by anyone" ON faqs;

-- ============================================
-- GUESTS - dostęp dla anon i authenticated
-- ============================================
CREATE POLICY "Guests are readable by anyone with API key"
  ON guests FOR SELECT
  TO anon, authenticated
  USING (true);

-- ============================================
-- RSVP_RESPONSES - użytkownik może zarządzać swoimi danymi
-- ============================================
CREATE POLICY "Users can view their own RSVP"
  ON rsvp_responses FOR SELECT
  TO authenticated
  USING (
    guest_id IN (
      SELECT id FROM guests
      WHERE email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "Users can insert their own RSVP"
  ON rsvp_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    guest_id IN (
      SELECT id FROM guests
      WHERE email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "Users can update their own RSVP"
  ON rsvp_responses FOR UPDATE
  TO authenticated
  USING (
    guest_id IN (
      SELECT id FROM guests
      WHERE email = auth.jwt()->>'email'
    )
  )
  WITH CHECK (
    guest_id IN (
      SELECT id FROM guests
      WHERE email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "Users can delete their own RSVP"
  ON rsvp_responses FOR DELETE
  TO authenticated
  USING (
    guest_id IN (
      SELECT id FROM guests
      WHERE email = auth.jwt()->>'email'
    )
  );

-- ============================================
-- FAQs - dostęp dla wszystkich
-- ============================================
CREATE POLICY "FAQs are readable by anyone"
  ON faqs FOR SELECT
  TO anon, authenticated
  USING (true);
