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

async function loadPartnerMeta(slug: string) {
  try {
    const idxPath = path.join(process.cwd(), 'public', 'partners', 'index.json');
    const buf = await fs.readFile(idxPath, 'utf-8');
    const list = JSON.parse(buf) as Array<{ slug: string; title?: string }>;
    const item = list.find(i => i.slug === slug);
    return item ?? { slug, title: slug };
  } catch {
    return { slug, title: slug } as const;
  }
}

export default async function PartnerPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const tours = await loadPartner(slug);
  const meta = await loadPartnerMeta(slug);

  const partnerTitle = meta.title || slug;
  const heroImage = tours?.[0]?.images?.[0] as string | undefined;
  const partnerRating = 5.0; // первому клиенту — 5 звёзд

  return (
    <main style={{ padding: 24, display: 'grid', gap: 20 }}>
      {/* Hero */}
      <section style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid #e8eef5' }}>
        {heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroImage} alt={partnerTitle} style={{ width: '100%', height: 280, objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: 180, background: '#f0f4fa' }} />
        )}
        <div style={{ position: 'absolute', left: 16, bottom: 16, right: 16, color: '#fff' }}>
          <div style={{
            display: 'inline-flex',
            padding: '6px 10px',
            background: 'rgba(0,0,0,0.45)',
            borderRadius: 999,
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ fontWeight: 800 }}>{partnerTitle}</span>
            <span>★★★★★ {partnerRating.toFixed(1)}</span>
          </div>
        </div>
      </section>

      {/* Partner badges */}
      <section style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {['Wi‑Fi', 'All inclusive', 'Поздний заезд', 'Без комаров'].map(b => (
          <span key={b} style={{ background: '#E7F0FB', color: '#2B6CB0', borderRadius: 999, padding: '8px 12px', fontWeight: 600, fontSize: 13 }}>{b}</span>
        ))}
      </section>

      {/* Tours list */}
      <section style={{ display: 'grid', gap: 16 }}>
        {tours.map(t => (
          <article key={t.id} style={{ border: '1px solid #e8eef5', borderRadius: 12, overflow: 'hidden' }}>
            {t.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.images[0]} alt={t.title} style={{ width: '100%', height: 220, objectFit: 'cover' }} />
            ) : null}
            <div style={{ padding: 14, display: 'grid', gap: 6 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>{t.title}</h3>
              <p style={{ margin: 0, color: '#5C738A', fontSize: 13 }}>
                {t.activity} • {t.region} • {t.duration_days} дн.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: '#2B6CB0' }}>от {t.price_from} ₽</strong>
                <a href="#" style={{ color: '#4A90E2', fontWeight: 700, textDecoration: 'none' }}>Подробнее</a>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Support CTA */}
      <section style={{ background: '#2C3E50', color: '#fff', borderRadius: 12, padding: 16, display: 'grid', gap: 8 }}>
        <div style={{ fontWeight: 800 }}>Нужна помощь с выбором?</div>
        <div style={{ opacity: 0.9, fontSize: 14 }}>Напишите нам — подскажем даты, экипировку и трансфер</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="#" style={{ background: '#4A90E2', color: '#fff', padding: '10px 14px', borderRadius: 10, textDecoration: 'none', fontWeight: 800 }}>Чат</a>
          <a href="#" style={{ background: '#fff', color: '#2C3E50', padding: '10px 14px', borderRadius: 10, textDecoration: 'none', fontWeight: 800 }}>Позвонить</a>
        </div>
      </section>
    </main>
  );
}

