-- Tabela stołów weselnych
CREATE TABLE IF NOT EXISTS wedding_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number INTEGER NOT NULL UNIQUE,
  table_name VARCHAR(100), -- np. "Stół Państwa Młodych", "Stół 1"
  capacity INTEGER DEFAULT 10,
  position_x INTEGER DEFAULT 0, -- pozycja X na mapie sali (w %)
  position_y INTEGER DEFAULT 0, -- pozycja Y na mapie sali (w %)
  is_bride_groom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dodaj kolumnę table_id do guests (przypisanie gościa do stołu)
ALTER TABLE guests
ADD COLUMN IF NOT EXISTS table_id UUID REFERENCES wedding_tables(id);

-- Wstaw stoły weselne (7 stołów + stół Państwa Młodych)
INSERT INTO wedding_tables (table_number, table_name, capacity, position_x, position_y, is_bride_groom) VALUES
  (0, 'Stół Państwa Młodych', 2, 75, 50, TRUE),
  (1, 'Stół 1', 10, 85, 20, FALSE),
  (2, 'Stół 2', 10, 85, 35, FALSE),
  (3, 'Stół 3', 10, 85, 50, FALSE),
  (4, 'Stół 4', 10, 85, 65, FALSE),
  (5, 'Stół 5', 10, 85, 80, FALSE),
  (6, 'Stół 6', 10, 70, 80, FALSE),
  (7, 'Stół 7', 10, 55, 80, FALSE)
ON CONFLICT (table_number) DO NOTHING;

-- RLS policies dla wedding_tables
ALTER TABLE wedding_tables ENABLE ROW LEVEL SECURITY;

-- Wszyscy zalogowani goście mogą widzieć stoły
CREATE POLICY "Guests can view tables" ON wedding_tables
  FOR SELECT USING (true);

-- Widok do pobrania stołu z gośćmi
CREATE OR REPLACE VIEW table_assignments AS
SELECT
  wt.id as table_id,
  wt.table_number,
  wt.table_name,
  wt.capacity,
  wt.position_x,
  wt.position_y,
  wt.is_bride_groom,
  g.id as guest_id,
  g.full_name as guest_name
FROM wedding_tables wt
LEFT JOIN guests g ON g.table_id = wt.id
ORDER BY wt.table_number, g.full_name;
