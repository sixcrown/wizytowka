// Skopiuj ten plik do environment.ts i environment.development.ts
// i uzupełnij swoimi kluczami Supabase

export const environment = {
  production: false,
  supabase: {
    url: 'YOUR_SUPABASE_URL', // np. https://xxxxx.supabase.co
    anonKey: 'YOUR_SUPABASE_ANON_KEY', // klucz anon/public
  },
};
