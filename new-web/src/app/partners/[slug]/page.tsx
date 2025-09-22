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

async function loadInfoStand(slug: string): Promise<any | null> {
  try {
    const file = path.join(process.cwd(), 'public', 'partners', `${slug}-info.json`);
    const buf = await fs.readFile(file, 'utf-8');
    return JSON.parse(buf);
  } catch {
    return null;
  }
}

export default async function PartnerPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const tours = await loadPartner(slug);
  const meta = await loadPartnerMeta(slug);
  const info = await loadInfoStand(slug);

  const partnerTitle = meta.title || slug;
  const heroImage = tours?.[0]?.images?.[0] as string | undefined;
  const partnerRating = slug === 'kr' ? 5.0 : 4.9;

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

      {/* Info Stand (optional) */}
      {info ? (
        <section style={{ border: '1px solid #e8eef5', borderRadius: 12, padding: 16, display: 'grid', gap: 8 }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>{info.section}</div>
          <div style={{ display: 'grid', gap: 4, color: '#1B2B3A' }}>
            <div>Площадь: {info.area_ha} Га</div>
            <div>Длина: {info.length_m.toLocaleString('ru-RU')} м</div>
          </div>
          <div style={{ fontWeight: 700, marginTop: 6 }}>Границы</div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {info.dms_points?.map((p: string, i: number) => (
              <li key={i} style={{ color: '#5C738A' }}>{p}</li>
            ))}
          </ul>
          <div style={{ fontWeight: 700, marginTop: 6 }}>Договор</div>
          <div style={{ color: '#1B2B3A' }}>№ {info.contract?.number} от {info.contract?.date} — {info.contract?.purpose}</div>
          <div style={{ fontWeight: 700, marginTop: 6 }}>Пользователь</div>
          <div style={{ color: '#1B2B3A' }}>
            {info.company?.name}, ИНН {info.company?.inn}, ОГРН {info.company?.ogrn}
          </div>
          <div style={{ color: '#5C738A' }}>{info.company?.address}</div>
          <div style={{ color: '#5C738A' }}>Тел: {(info.company?.phones || []).join(', ')} • Сайт: {info.company?.site}</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <a href={info.map?.yandex} target="_blank" rel="noreferrer" style={{ color: '#4A90E2', fontWeight: 800 }}>Открыть в Яндекс.Картах</a>
            <a href={info.map?.google} target="_blank" rel="noreferrer" style={{ color: '#4A90E2', fontWeight: 800 }}>Открыть в Google Maps</a>
          </div>
        </section>
      ) : null}

      {/* Tours list */}
      <section style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))' }}>
        {tours.map(t => (
          <article key={t.id} style={{ border: '1px solid #e8eef5', borderRadius: 12, overflow: 'hidden', display: 'grid', gridTemplateRows: 'auto 1fr' }}>
            {t.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.images[0]} alt={t.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
            ) : null}
            <div style={{ padding: 14, display: 'grid', gap: 6 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>{t.title}</h3>
              <p style={{ margin: 0, color: '#5C738A', fontSize: 13, display: 'flex', gap: 6, alignItems: 'center' }}>
                <span>{t.activity}</span>
                <span>•</span>
                <span>{t.region}</span>
                <span>•</span>
                <span>{t.duration_days} дн.</span>
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: '#2B6CB0', fontSize: 18 }}>от {t.price_from} ₽</strong>
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

