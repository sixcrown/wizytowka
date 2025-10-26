const fs = require('fs');
const path = require('path');

// Get environment variables from Vercel or local .env
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const isProduction = process.env.NODE_ENV === 'production';

const envContent = `export const environment = {
  production: ${isProduction},
  supabase: {
    url: '${supabaseUrl}',
    anonKey: '${supabaseAnonKey}',
  },
};
`;

const envDir = path.join(__dirname, '..', 'src', 'environments');
const envFilePath = path.join(envDir, 'environment.ts');

// Ensure the environments directory exists
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

// Write the environment file
fs.writeFileSync(envFilePath, envContent);

console.log(`✅ Generated environment.ts for ${isProduction ? 'production' : 'development'}`);
