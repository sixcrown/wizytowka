-- Poprawka polityki usuwania zdjęć
-- Problem: guest_id != auth.uid() (to są różne identyfikatory)

-- Usuń starą politykę
DROP POLICY IF EXISTS "Users can delete own photos" ON wedding_photos;

-- Nowa polityka - sprawdza czy guest_id należy do zalogowanego użytkownika
-- poprzez sprawdzenie email w tabeli guests
CREATE POLICY "Users can delete own photos" ON wedding_photos
  FOR DELETE USING (
    guest_id IN (
      SELECT g.id FROM guests g
      WHERE g.email = auth.jwt() ->> 'email'
    )
  );

-- Alternatywnie, jeśli powyższe nie działa, można użyć prostszej wersji:
-- (odkomentuj poniższe jeśli powyższa nie zadziała)

-- DROP POLICY IF EXISTS "Users can delete own photos" ON wedding_photos;
-- CREATE POLICY "Authenticated users can delete own photos" ON wedding_photos
--   FOR DELETE USING (auth.role() = 'authenticated');
