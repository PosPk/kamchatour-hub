import fs from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-static';

async function loadPartner(slug: string) {
  const file = path.join(process.cwd(), 'public', 'partners', `${slug}.json`);
  const buf = await fs.readFile(file, 'utf-8');
  return JSON.parse(buf) as Array<any>;
}

export async function generateStaticParams() {
  const idxPath = path.join(process.cwd(), 'public', 'partners', 'index.json');
  const buf = await fs.readFile(idxPath, 'utf-8');
  const idx = JSON.parse(buf) as Array<{ slug: string }>;
  return idx.map(i => ({ slug: i.slug }));
}

export default async function PartnerPage({ params }: { params: { slug: string } }) {
  const tours = await loadPartner(params.slug);
  return (
    <main style={{ padding: 24 }}>
      <h1>Витрина: {params.slug}</h1>
      <div style={{ display: 'grid', gap: 16 }}>
        {tours.map(t => (
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

