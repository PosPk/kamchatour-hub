export const dynamic = 'force-dynamic';

export async function GET() {
  const YDB_ENDPOINT = process.env.YDB_ENDPOINT || null;
  const YDB_DATABASE = process.env.YDB_DATABASE || null;
  const YDB_DOCAPI = process.env.YDB_DOCAPI || null;
  const present = (v: string | null) => (v ? true : false);

  const body = {
    ok: true,
    service: 'ydb-health',
    env: {
      has_endpoint: present(YDB_ENDPOINT),
      has_database: present(YDB_DATABASE),
      has_docapi: present(YDB_DOCAPI),
    },
    ts: new Date().toISOString(),
  };

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

