import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const BUCKET = 'public';
const CONFIG_KEY = 'graphics/kamchatka-button/current.json';

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ url: null, note: 'missing_supabase_env' });
    const { data, error } = await supabase.storage.from(BUCKET).download(CONFIG_KEY);
    if (error) return NextResponse.json({ url: null });
    const text = await data.text();
    const json = JSON.parse(text || '{}');
    return NextResponse.json({ url: json?.url || null });
  } catch (e: any) {
    return NextResponse.json({ url: null });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ ok: false, error: 'missing_supabase_env' }, { status: 500 });
    const { url } = await req.json();
    if (!url) return NextResponse.json({ ok: false, error: 'no_url' }, { status: 400 });
    const payload = new Blob([JSON.stringify({ url })], { type: 'application/json' });
    const { error } = await supabase.storage.from(BUCKET).upload(CONFIG_KEY, payload, { contentType: 'application/json', upsert: true });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'save_failed' }, { status: 500 });
  }
}

