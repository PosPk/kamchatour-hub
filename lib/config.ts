export const env = {
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
};

export function hasSupabase(): boolean {
  return !!(env.supabaseUrl && env.supabaseAnonKey);
}

