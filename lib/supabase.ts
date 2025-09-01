import { createClient } from '@supabase/supabase-js';
import { env, hasSupabase } from './config';

export const supabase = hasSupabase() ? createClient(env.supabaseUrl, env.supabaseAnonKey) : null;

export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!env.supabaseUrl || !serviceKey) return null;
  return createClient(env.supabaseUrl, serviceKey);
}

