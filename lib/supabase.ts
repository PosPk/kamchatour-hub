import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Client-side (Expo) public client
const publicUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string | undefined;
const publicAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null = publicUrl && publicAnonKey
	? createClient(publicUrl, publicAnonKey)
	: null;

// Server-side (Vercel functions) service client
export const createServiceClient = (): SupabaseClient | null => {
	const serviceUrl = process.env.SUPABASE_URL as string | undefined;
	const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;
	if (!serviceUrl || !serviceKey) return null;
	return createClient(serviceUrl, serviceKey);
};

