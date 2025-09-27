import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const prefix = (formData.get('prefix') as string | null)?.replace(/[^a-zA-Z0-9_\-/]/g, '').replace(/\/+$/,'') || '';
    if (!file) return NextResponse.json({ error: 'no_file' }, { status: 400 });

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
      return NextResponse.json({ error: 'missing_supabase_env' }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, { auth: { persistSession: false } });
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const key = `${prefix ? prefix + '/' : 'graphics/kamchatka-button/'}${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('public').upload(key, bytes, { contentType: file.type, upsert: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const { data: pub } = supabase.storage.from('public').getPublicUrl(key);
    return NextResponse.json({ ok: true, url: pub.publicUrl, key });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'upload_failed' }, { status: 500 });
  }
}

