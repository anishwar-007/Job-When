import { createClient } from '@supabase/supabase-js';

// Create React App uses REACT_APP_* env vars. (Vite would use VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
