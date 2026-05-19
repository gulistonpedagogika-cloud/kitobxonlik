import { createClient } from '@supabase/supabase-js';

let rawUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const rawKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

// Clean up URL if user provided the API endpoint instead of the project root
if (rawUrl.includes('.supabase.co')) {
  rawUrl = rawUrl.split('.supabase.co')[0] + '.supabase.co';
}

export const isSupabaseConfigured = rawUrl && rawUrl !== 'https://placeholder.supabase.co';

export const supabase = createClient(
  rawUrl || 'https://placeholder.supabase.co',
  rawKey || 'placeholder'
);
