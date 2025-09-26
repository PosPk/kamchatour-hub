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
    if (!supabase) return NextResponse.json({ url: null, note: 'missing_supabase_env' }, { headers: { 'Cache-Control': 'no-store' } });
    const { data, error } = await supabase.storage.from(BUCKET).download(CONFIG_KEY);
    if (error) return NextResponse.json({ url: null }, { headers: { 'Cache-Control': 'no-store' } });
    const text = await data.text();
    const json = JSON.parse(text || '{}');

    // Ensure a pinned copy exists so the image remains available forever
    try {
      const imgUrl: string | undefined = json?.url;
      if (imgUrl) {
        const { data: files } = await supabase.storage.from(BUCKET).list('graphics/kamchatka-button');
        const hasPinned = (files || []).some((f: any) => typeof f?.name === 'string' && f.name.startsWith('pinned.'));
        if (!hasPinned) {
          const resp = await fetch(imgUrl);
          if (resp.ok) {
            const contentType = resp.headers.get('content-type') || 'application/octet-stream';
            const ext = contentType.includes('svg') ? '.svg' : (contentType.includes('png') ? '.png' : (imgUrl.split('?')[0].toLowerCase().endsWith('.svg') ? '.svg' : (imgUrl.split('?')[0].toLowerCase().endsWith('.png') ? '.png' : '')));
            const key = `graphics/kamchatka-button/pinned${ext || ''}`;
            const arrayBuffer = await resp.arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer);
            await supabase.storage.from(BUCKET).upload(key, bytes, { contentType, upsert: true });
          }
        }
      }
    } catch {}

    return NextResponse.json({ url: json?.url || null }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    return NextResponse.json({ url: null }, { headers: { 'Cache-Control': 'no-store' } });
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

    // Also pin the current file in storage to ensure it stays available
    try {
      const resp = await fetch(url);
      if (resp.ok) {
        const contentType = resp.headers.get('content-type') || 'application/octet-stream';
        const ext = contentType.includes('svg') ? '.svg' : (contentType.includes('png') ? '.png' : (url.split('?')[0].toLowerCase().endsWith('.svg') ? '.svg' : (url.split('?')[0].toLowerCase().endsWith('.png') ? '.png' : '')));
        const key = `graphics/kamchatka-button/pinned${ext || ''}`;
        const arrayBuffer = await resp.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        await supabase.storage.from(BUCKET).upload(key, bytes, { contentType, upsert: true });
      }
    } catch {}
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'save_failed' }, { status: 500 });
  }
}

