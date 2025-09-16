import { NextResponse } from 'next/server';
import { createServiceClient } from '../../../../lib/supabase';

export async function POST(req: any) {
  try {
    const { title, imageUrl, userId } = await req.json();
    if (!imageUrl) return NextResponse.json({ ok: false, error: 'imageUrl required' }, { status: 400 });
    const supabase = createServiceClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('feed_posts')
        .insert({ title, image_url: imageUrl, user_id: userId || null, likes: 0 })
        .select('id')
        .single();
      if (error) throw error;
      return NextResponse.json({ ok: true, id: data?.id });
    }
    return NextResponse.json({ ok: true, id: null });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'feed post failed' }, { status: 500 });
  }
}

