-- ============================================
-- Aktualizacja Polityk RLS dla Invite Code Auth
-- Uruchom to ZAMIAST lub PO podstawowym schemacie
-- ============================================

-- Usuń stare polityki
DROP POLICY IF EXISTS "Users can view their own RSVP" ON rsvp_responses;
DROP POLICY IF EXISTS "Users can insert their own RSVP" ON rsvp_responses;
DROP POLICY IF EXISTS "Users can update their own RSVP" ON rsvp_responses;

-- Nowe polityki używające user metadata
-- Użytkownik może czytać swoje RSVP jeśli guest_id w tabeli pasuje do guest_id w user metadata
CREATE POLICY "Users can view their own RSVP"
  ON rsvp_responses FOR SELECT
  TO authenticated
  USING (
    guest_id IN (
      SELECT id FROM guests
      WHERE email = auth.jwt()->>'email'
    )
  );

-- Użytkownik może dodać RSVP dla swojego guest_id
CREATE POLICY "Users can insert their own RSVP"
  ON rsvp_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    guest_id IN (
      SELECT id FROM guests
      WHERE email = auth.jwt()->>'email'
    )
  );

-- Użytkownik może aktualizować swoje RSVP
CREATE POLICY "Users can update their own RSVP"
  ON rsvp_responses FOR UPDATE
  TO authenticated
  USING (
    guest_id IN (
      SELECT id FROM guests
      WHERE email = auth.jwt()->>'email'
    )
  );

-- Polityka dla guests pozostaje bez zmian
-- Ale upewnijmy się że jest prawidłowa
DROP POLICY IF EXISTS "Guests are viewable by authenticated users" ON guests;
CREATE POLICY "Guests are viewable by authenticated users"
  ON guests FOR SELECT
  TO authenticated
  USING (true);

-- Polityka dla FAQs pozostaje bez zmian
DROP POLICY IF EXISTS "FAQs are viewable by everyone" ON faqs;
CREATE POLICY "FAQs are viewable by everyone"
  ON faqs FOR SELECT
  TO authenticated
  USING (true);
