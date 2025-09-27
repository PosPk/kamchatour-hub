import fs from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-static';

async function loadIndex() {
  const file = path.join(process.cwd(), 'public', 'partners', 'index.json');
  const buf = await fs.readFile(file, 'utf-8');
  return JSON.parse(buf) as Array<{ slug: string; title: string }>;
}

export default async function PartnersPage() {
  const data = await loadIndex();
  return (
    <main style={{ padding: 24 }}>
      <h1>Партнёры</h1>
      <ul>
        {data.map(p => (
          <li key={p.slug}>
            <a href={`/partners/${p.slug}`}>{p.title}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}

