// Tilda ingestion via official API
// GET /api/ingest/tilda?projectId=...&limit=100
// Env required: TILDA_PUBLIC_KEY, TILDA_SECRET_KEY
// Response: { items: Array<{ id:string, title:string, url:string|null, image:string|null, html?:string|null }> }

type TildaProject = { id: string; title: string };
type TildaPage = { id: string; title: string; alias?: string; url?: string; img?: string };

async function callTilda(endpoint: string, params: Record<string, string>) {
  const pk = process.env.TILDA_PUBLIC_KEY as string | undefined;
  const sk = process.env.TILDA_SECRET_KEY as string | undefined;
  if (!pk || !sk) return null;
  const url = new URL(`https://api.tilda.cc/${endpoint}`);
  url.searchParams.set('publickey', pk);
  url.searchParams.set('secretkey', sk);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const r = await fetch(url.toString());
  if (!r.ok) return null;
  const j = await r.json();
  if (!j || j.status !== 'FOUND') return null;
  return j;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method Not Allowed' }); return; }
  try {
    const projectId = String(req.query?.projectId || '').trim();
    const limit = Math.min(200, Math.max(1, Number(req.query?.limit || 100) || 100));

    let targetProjectId = projectId;
    if (!targetProjectId) {
      const pr = await callTilda('v1/getprojectslist/', {});
      const projects: TildaProject[] = pr?.result || [];
      targetProjectId = (projects[0]?.id as string) || '';
    }
    if (!targetProjectId) { res.status(200).json({ items: [] }); return; }

    const pagesRes = await callTilda('v1/getpageslist/', { projectid: String(targetProjectId) });
    const pages: TildaPage[] = Array.isArray(pagesRes?.result) ? pagesRes.result : [];
    const items = pages.slice(0, limit).map((p) => ({
      id: String(p.id),
      title: p.title || '',
      url: p.url || null,
      image: p.img || null,
    }));
    res.status(200).json({ items });
  } catch (e: any) {
    res.status(200).json({ items: [] });
  }
}

