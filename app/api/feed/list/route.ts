import { NextResponse } from 'next/server';
import { createServiceClient } from '../../../../lib/supabase';

export async function GET() {
  try {
    const supabase = createServiceClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('feed_posts')
        .select('id, title, image_url, likes, created_at')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return NextResponse.json({ ok: true, items: data });
    }
    return NextResponse.json({ ok: true, items: [] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'feed list failed' }, { status: 500 });
  }
}

