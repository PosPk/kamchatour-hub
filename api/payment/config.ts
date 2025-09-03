export default async function handler(req: Request): Promise<Response> {
  try {
    const publicId = process.env.CP_PUBLIC_ID || '';
    const testMode = (process.env.CP_TEST_MODE || 'false') === 'true';
    if (!publicId) {
      return new Response(JSON.stringify({ enabled: false }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(
      JSON.stringify({ enabled: true, publicId, testMode }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

