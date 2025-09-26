// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as cheerio from 'cheerio';

// Ingest souvenirs from dar-severa.ru (best-effort scraper)
// GET /api/ingest/dar-severa?url=https://dar-severa.ru/
// -> { items: Array<{ id:string, title:string, price:number|null, image:string|null, url:string }> }

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method Not Allowed' }); return; }
  try {
    const baseUrl = String(req.query?.url || 'https://dar-severa.ru/');
    const r = await fetch(baseUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!r.ok) { res.status(502).json({ items: [] }); return; }
    const html = await r.text();
    const $ = cheerio.load(html);
    const items: any[] = [];
    $('a, .product, .catalog-item').each((_: unknown, el: unknown) => {
      try {
        const el$ = $(el as any);
        const title = (el$.attr('title') || el$.find('.product-title, .title').text() || '').trim();
        let href = el$.attr('href') || el$.find('a').attr('href') || '';
        const img = el$.find('img').attr('src') || el$.find('img').attr('data-src') || '';
        const priceText = (el$.find('.price, .product-price, .cost').text() || '').replace(/[^0-9]/g, '');
        if (!title || !href) return;
        if (href.startsWith('/')) href = new URL(href, baseUrl).toString();
        const id = Buffer.from(href).toString('base64').replace(/=+$/,'');
        items.push({ id, title, price: priceText ? Number(priceText) : null, image: img || null, url: href });
      } catch (_) {}
    });
    // dedupe by url
    const seen = new Set<string>();
    const normalized = items.filter(x=>{ if(seen.has(x.url)) return false; seen.add(x.url); return true; }).slice(0, 100);
    res.status(200).json({ items: normalized });
  } catch (e: any) {
    res.status(200).json({ items: [] });
  }
}

