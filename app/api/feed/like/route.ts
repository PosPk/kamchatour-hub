import { NextResponse } from 'next/server';
import { createServiceClient } from '../../../../lib/supabase';

export async function POST(req: any) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 });
    const supabase = createServiceClient();
    if (supabase) {
      const { error } = await supabase.rpc('feed_like', { post_id: id });
      if (error) throw error;
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'feed like failed' }, { status: 500 });
  }
}

