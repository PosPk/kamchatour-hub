export const config = { runtime: 'edge' };

async function fetchIcon(term: string, apiKey: string, apiSecret: string) {
  const url = `https://api.thenounproject.com/icons/${encodeURIComponent(term)}?limit=1`; // simple search
  const auth = 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
  const r = await fetch(url, { headers: { Authorization: auth } });
  if (!r.ok) throw new Error(`nounproject ${r.status}`);
  const j = await r.json();
  const icon = j?.icons?.[0];
  if (!icon) return null;
  return {
    id: icon.id,
    term: icon.term,
    preview: icon.preview_url || icon.preview_url_84 || icon.preview_url_42,
    author: icon.uploader?.name,
    attribution: icon.attribution,
    svg_url: icon.icon_url || icon.svg_url,
  };
}

export default async function handler(req: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();
    if (!q) return new Response(JSON.stringify({ error: 'q required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    const apiKey = process.env.NOUNPROJECT_KEY || '';
    const apiSecret = process.env.NOUNPROJECT_SECRET || '';
    if (!apiKey || !apiSecret) return new Response(JSON.stringify({ error: 'not_configured' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    const icon = await fetchIcon(q, apiKey, apiSecret);
    return new Response(JSON.stringify({ icon }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

