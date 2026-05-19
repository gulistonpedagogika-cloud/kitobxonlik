import { createClient } from '@supabase/supabase-js';

// Foydalanuvchi taqdim etgan ma'lumotlar
const HARDCODED_URL = 'https://dlnpfqajtojngsxdtedi.supabase.co';
const HARDCODED_KEY = 'sb_publishable_p7KR5yDGSxOSZfQ9dCjbLA_6ZIDslRQ';

let rawUrl = (import.meta as any).env.VITE_SUPABASE_URL || HARDCODED_URL;
const rawKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || HARDCODED_KEY;

// Clean up URL
if (rawUrl.includes('.supabase.co')) {
  rawUrl = rawUrl.split('.supabase.co')[0] + '.supabase.co';
}

export const isSupabaseConfigured = rawUrl && rawUrl !== 'https://placeholder.supabase.co' && rawKey !== 'placeholder';

export const supabase = createClient(rawUrl, rawKey);
