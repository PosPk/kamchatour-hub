// Activities list from partner (Tilda) with demo fallback
import type { NextApiRequest, NextApiResponse } from 'next';

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

async function fetchFromTilda(): Promise<Activity[]> {
  const pub = process.env.TILDA_PUBLIC_KEY;
  const secret = process.env.TILDA_SECRET_KEY;
  const projectId = process.env.TILDA_PROJECT_ID;
  if (!pub || !secret || !projectId) return [];
  // Using Tilda API: https://help.tilda.cc/api/overview
  // Example endpoints:
  //  - getpageslist: https://api.tilda.cc/v1/getpageslist/?publickey=...&secretkey=...&projectid=...
  try {
    const base = 'https://api.tilda.cc/v1';
    const pagesRes = await fetch(`${base}/getpageslist/?publickey=${pub}&secretkey=${secret}&projectid=${projectId}`);
    const pagesJson = await pagesRes.json();
    const pages: any[] = pagesJson?.result || [];
    // Map minimal fields
    const items: Activity[] = pages.map((p: any) => ({
      id: String(p.id),
      title: p.title || p.name || 'Без названия',
      short_desc: p.descr || undefined,
      image: p.img || p.imgcover || undefined,
      tags: (p.tags || '').split(',').map((s: string) => s.trim()).filter(Boolean),
    }));
    return items;
  } catch {
    return [];
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }
  try {
    const q = String((req.query?.q as string) || '').toLowerCase();
    let items: Activity[] = await fetchFromTilda();
    if (!items.length) {
      // Demo fallback
      items = [
        { id: 'a1', title: 'Сплав по реке Авача', short_desc: 'Водная активность, 1 день', duration: '1 день', price: 4500, currency: 'RUB', difficulty: 'easy', image: 'https://images.unsplash.com/photo-1528139402190-6c4f640d6dd2?q=80&w=1600' },
        { id: 'a2', title: 'Трекинг к вулкану Горелый', short_desc: 'Пеший маршрут, 8 часов', duration: '8 часов', price: 6000, currency: 'RUB', difficulty: 'medium', image: 'https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?q=80&w=1600' },
        { id: 'a3', title: 'Медвежье сафари', short_desc: 'Наблюдение за медведями', duration: '1 день', price: 12000, currency: 'RUB', difficulty: 'easy', image: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?q=80&w=1600' },
      ];
    }
    const filtered = q ? items.filter(x => x.title.toLowerCase().includes(q) || (x.short_desc || '').toLowerCase().includes(q)) : items;
    res.status(200).json({ ok: true, items: filtered });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || 'activities list failed' });
  }
}

