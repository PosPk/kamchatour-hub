import { NextResponse } from 'next/server';
import { createServiceClient } from '../../../../lib/supabase';

export async function POST(req: any) {
  try {
    const { postId, text, userId } = await req.json();
    if (!postId || !text) return NextResponse.json({ ok: false, error: 'postId and text required' }, { status: 400 });
    const supabase = createServiceClient();
    if (supabase) {
      const { error } = await supabase.from('feed_comments').insert({ post_id: postId, text, user_id: userId || null });
      if (error) throw error;
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'feed comment failed' }, { status: 500 });
  }
}

