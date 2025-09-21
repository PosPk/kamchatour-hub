import { NextResponse } from 'next/server';

type Activity = {
  id: string;
  title: string;
  short_desc?: string;
  price?: number;
  currency?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  duration?: string;
  image?: string;
  tags?: string[];
  season?: string;
};

export async function GET(req: any) {
  try {
    const url = new URL(req.url);
    const q = String(url.searchParams.get('q') || '').toLowerCase();
    let items: Activity[] = [];
    const pub = process.env.TILDA_PUBLIC_KEY as string | undefined;
    const secret = process.env.TILDA_SECRET_KEY as string | undefined;
    const projectId = process.env.TILDA_PROJECT_ID as string | undefined;
    if (pub && secret && projectId) {
      try {
        const base = 'https://api.tilda.cc/v1';
        const pagesRes = await fetch(`${base}/getpageslist/?publickey=${pub}&secretkey=${secret}&projectid=${projectId}`);
        const pagesJson = await pagesRes.json();
        const pages: any[] = pagesJson?.result || [];
        items = pages.map((p: any) => ({
          id: String(p.id),
          title: p.title || p.name || 'Без названия',
          short_desc: p.descr || undefined,
          image: p.img || p.imgcover || undefined,
          tags: String(p.tags || '')
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean),
        }));
      } catch {}
    }
    if (!items.length) {
      items = [
        { id: 'a1', title: 'Сплав по реке Авача', short_desc: 'Водная активность, 1 день', duration: '1 день', price: 4500, currency: 'RUB', difficulty: 'easy', image: 'https://images.unsplash.com/photo-1528139402190-6c4f640d6dd2?q=80&w=1600' },
        { id: 'a2', title: 'Трекинг к вулкану Горелый', short_desc: 'Пеший маршрут, 8 часов', duration: '8 часов', price: 6000, currency: 'RUB', difficulty: 'medium', image: 'https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?q=80&w=1600' },
        { id: 'a3', title: 'Медвежье сафари', short_desc: 'Наблюдение за медведями', duration: '1 день', price: 12000, currency: 'RUB', difficulty: 'easy', image: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?q=80&w=1600' },
      ];
    }
    const filtered = q
      ? items.filter(x => x.title.toLowerCase().indexOf(q) >= 0 || (x.short_desc || '').toLowerCase().indexOf(q) >= 0)
      : items;
    return NextResponse.json({ ok: true, items: filtered });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'activities list failed' }, { status: 500 });
  }
}

