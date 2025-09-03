function parseCookies(header: string | null): Record<string, string> { const o: any = {}; if(!header) return o; header.split(';').forEach(p=>{ const i=p.indexOf('='); if(i>-1) o[p.slice(0,i).trim()]=decodeURIComponent(p.slice(i+1).trim()); }); return o; }

export default async function handler(req: Request): Promise<Response> {
  try {
    const publicId = process.env.CP_PUBLIC_ID || '';
    const testMode = (process.env.CP_TEST_MODE || 'false') === 'true';
    if (!publicId) {
      return new Response(JSON.stringify({ enabled: false }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    const cookies = parseCookies(req.headers.get('cookie'));
    const level = (cookies['op_level'] || 'L1').toUpperCase();
    const commissionMap: Record<string, number> = { L1: 0.10, L2: 0.07, L3: 0.05 };
    const commission = commissionMap[level] ?? 0.10;
    return new Response(
      JSON.stringify({ enabled: true, publicId, testMode, commission, level }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

