import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface HealthActivity {
  id: string;
  activity_type: 'water' | 'steps' | 'sleep';
  value: number;
  logged_at: string;
  notes?: string;
  created_at: string;
}
