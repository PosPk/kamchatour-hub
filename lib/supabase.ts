import { createClient } from '@supabase/supabase-js';
import { env, hasSupabase } from './config';

export const supabase = hasSupabase() ? createClient(env.supabaseUrl, env.supabaseAnonKey) : null;

export function createServiceClient() {
  const url = process.env.SUPABASE_URL as string | undefined;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;
  if (!url || !serviceKey) return null;
  try {
    return createClient(url, serviceKey, {
      auth: { persistSession: false },
    });
  } catch {
    return null;
  }
}

