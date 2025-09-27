import fs from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-static';

async function loadAll() {
  const dir = path.join(process.cwd(), 'public', 'partners');
  const files = await fs.readdir(dir);
  const jsons = files.filter(f => f.endsWith('.json') && f !== 'index.json');
  const all = await Promise.all(
    jsons.map(async f => JSON.parse(await fs.readFile(path.join(dir, f), 'utf-8')) as Array<any>),
  );
  return all.flat();
}

function matches(t: any, q: string, activity?: string, region?: string) {
  const text = `${t.title} ${t.activity} ${t.region}`.toLowerCase();
  if (q && !text.includes(q.toLowerCase())) return false;
  if (activity && t.activity !== activity) return false;
  if (region && t.region !== region) return false;
  return true;
}

export default async function SearchPage({ searchParams }: { searchParams: Record<string, string> }) {
  const q = searchParams.q || '';
  const activity = searchParams.activity || '';
  const region = searchParams.region || '';
  const all = await loadAll();
  const filtered = all.filter(t => matches(t, q, activity || undefined, region || undefined));
  return (
    <main style={{ padding: 24 }}>
      <h1>Поиск</h1>
      <p>
        Найдено: {filtered.length} {q ? `(по запросу “${q}”)` : ''}
      </p>
      <div style={{ display: 'grid', gap: 16 }}>
        {filtered.map(t => (
          <article key={t.id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
            <h3>{t.title}</h3>
            <p>
              {t.activity} • {t.region} • от {t.price_from} ₽ • {t.duration_days} дней
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}

