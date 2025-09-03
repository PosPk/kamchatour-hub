export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  const key = process.env.MAPTILER_API_KEY || '';
  return new Response(
    JSON.stringify({ enabled: Boolean(key), key }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}

