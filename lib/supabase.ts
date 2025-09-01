import { createClient } from '@supabase/supabase-js';
import { env, hasSupabase } from './config';

export const supabase = hasSupabase() ? createClient(env.supabaseUrl, env.supabaseAnonKey) : null;

