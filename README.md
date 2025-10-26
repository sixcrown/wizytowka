# Wizytówka & Ślub - Aplikacja Weselna

Projekt łączy stronę wizytówkową/CV z aplikacją do zarządzania gośćmi weselnymi.

## 📋 Funkcje

### Strona Główna (/)
- Profesjonalna wizytówka/CV
- Sekcje: O mnie, Umiejętności, Doświadczenie, Kontakt
- Design z Angular Material
- Link do sekcji weselnej

### Sekcja Weselna (/slub)
- **System logowania** - za pomocą kodów zaproszeń
- **Formularz RSVP** - potwierdzenie obecności, liczba gości, wymagania dietetyczne, nocleg
- **Dashboard gościa** - spersonalizowane powitanie
- **FAQ** - najczęściej zadawane pytania
- **Responsywny design** - działa na wszystkich urządzeniach

## 🛠️ Stack Technologiczny

- **Frontend**: Angular 20.3 z SSR (Server-Side Rendering)
- **UI Framework**: Angular Material
- **Backend**: Supabase (BaaS)
- **Database**: PostgreSQL (przez Supabase)
- **Styling**: SCSS
- **Hosting**: Vercel (gotowe do wdrożenia)

## 📦 Instalacja

```bash
# Sklonuj repozytorium
git clone <repo-url>
cd wizytowka

# Zainstaluj zależności
npm install
```

## ⚙️ Konfiguracja Supabase

### 1. Utwórz projekt w Supabase

Przejdź do [supabase.com](https://supabase.com) i utwórz nowy projekt.

### 2. Utwórz tabele w bazie danych

Wykonaj poniższe zapytania SQL w Supabase SQL Editor:

```sql
-- Tabela gości
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela odpowiedzi RSVP
CREATE TABLE rsvp_responses (
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
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dodaj przykładowe FAQ
INSERT INTO faqs (question, answer, "order") VALUES
  ('O której godzinie zaczyna się ceremonia?', 'Ceremonia rozpoczyna się o 15:00.', 1),
  ('Gdzie odbędzie się wesele?', 'Wesele odbędzie się w Hotelu Przykładowy, ul. Weselna 1, Warszawa.', 2),
  ('Czy są dostępne miejsca parkingowe?', 'Tak, hotel posiada bezpłatny parking dla gości.', 3),
  ('Do kiedy muszę potwierdzić obecność?', 'Prosimy o potwierdzenie do 30 dni przed ślubem.', 4);

-- Dodaj przykładowego gościa (hasło: test123)
INSERT INTO guests (email, full_name, invite_code) VALUES
  ('gosc@example.com', 'Jan Kowalski', 'ABC123');
```

### 3. Skonfiguruj Row Level Security (RLS)

```sql
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
```

### 4. Skopiuj klucze do projektu

1. W Supabase przejdź do Settings → API
2. Skopiuj `URL` i `anon public` key
3. Zaktualizuj plik `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  supabase: {
    url: 'TWÓJ_SUPABASE_URL',
    anonKey: 'TWÓJ_SUPABASE_ANON_KEY',
  },
};
```

## 🚀 Uruchomienie

```bash
# Development server
npm start
# lub
ng serve

# Aplikacja dostępna na http://localhost:4200
```

## 📱 Struktura Projektu

```
src/
├── app/
│   ├── pages/
│   │   ├── home/              # Strona główna/CV
│   │   └── wedding/           # Sekcja weselna
│   │       ├── login/         # Logowanie gości
│   │       ├── guest-dashboard/ # Dashboard z RSVP i FAQ
│   │       └── wedding.ts     # Główny komponent
│   ├── services/
│   │   ├── auth.ts            # Serwis autoryzacji
│   │   └── wedding.ts         # Serwis RSVP i FAQ
│   └── app.routes.ts          # Konfiguracja routingu
└── environments/
    └── environment.ts         # Konfiguracja Supabase
```

## 🌐 Deployment na Vercel

```bash
# Zainstaluj Vercel CLI
npm i -g vercel

# Deploy
vercel

# Dodaj environment variables w Vercel dashboard:
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
```

Alternatywnie możesz połączyć repozytorium GitHub z Vercel i deployment będzie automatyczny.

## 🎨 Personalizacja

### Zmień dane osobowe na stronie głównej

Edytuj `src/app/pages/home/home.ts`:
- Zmień imię i nazwisko w toolbarze
- Dostosuj sekcję "O mnie"
- Zaktualizuj umiejętności i doświadczenie
- Dodaj swoje linki kontaktowe

### Dostosuj kolory

Możesz zmienić palety kolorów w:
- `src/app/pages/home/home.scss` - strona główna
- `src/app/pages/wedding/login/login.scss` - logowanie
- `src/app/pages/wedding/guest-dashboard/guest-dashboard.scss` - dashboard

## 📝 Dodawanie Gości

Aby dodać nowych gości do systemu, wykonaj zapytanie SQL w Supabase:

```sql
INSERT INTO guests (email, full_name, invite_code) VALUES
  ('email@example.com', 'Imię Nazwisko', 'UNIKATOWY_KOD');
```

**Uwaga**: Kod zaproszenia musi być unikalny dla każdego gościa.

## 🔒 Bezpieczeństwo

- Wszystkie dane przechowywane są w Supabase z włączonym RLS
- Goście mają dostęp tylko do swoich własnych danych RSVP
- Klucze API powinny być przechowywane jako zmienne środowiskowe

## 📖 Dodatkowe Informacje

### Dostępne komendy

```bash
npm start          # Uruchom development server
npm run build      # Zbuduj projekt
npm test           # Uruchom testy
ng generate        # Generuj nowe komponenty/serwisy
```

### Wsparcie

Jeśli masz pytania lub napotkasz problemy:
1. Sprawdź dokumentację Angular: https://angular.dev
2. Sprawdź dokumentację Supabase: https://supabase.com/docs
3. Sprawdź Angular Material: https://material.angular.io

## 📄 Licencja

MIT

---

Stworzone z ❤️ przy użyciu Angular 20 + Supabase + Angular Material
