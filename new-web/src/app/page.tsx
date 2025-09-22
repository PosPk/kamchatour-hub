import Link from 'next/link';

export default function Page() {
  const chipStyle: React.CSSProperties = {
    background: '#E7F0FB',
    color: '#2B6CB0',
    borderRadius: 999,
    padding: '8px 12px',
    fontWeight: 700,
    fontSize: 13,
    whiteSpace: 'nowrap',
  };

  const sectionCard: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #e8eef5',
    borderRadius: 14,
    padding: 16,
    display: 'grid',
    gap: 12,
  };

  return (
    <main style={{ padding: 24, display: 'grid', gap: 20 }}>
      {/* Hero */}
      <section style={{
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #4A90E2 0%, #2B6CB0 100%)',
        color: '#fff',
        padding: 20,
        display: 'grid',
        gap: 12,
      }}>
        <div style={{ fontSize: 28, fontWeight: 900 }}>Камчатка — ближе, чем кажется</div>
        <div style={{ opacity: 0.95, fontSize: 15 }}>Туры, партнёры, бронирование и поддержка — в одном месте</div>
        <form action="/search" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            name="q"
            placeholder="Куда поедем? вулканы, океан, медведи…"
            style={{
              flex: 1,
              height: 44,
              borderRadius: 10,
              border: 0,
              padding: '0 12px',
              outline: 'none',
              color: '#1B2B3A',
            }}
          />
          <button type="submit" style={{
            height: 44,
            borderRadius: 10,
            padding: '0 14px',
            background: '#fff',
            color: '#2B6CB0',
            fontWeight: 900,
            border: 0,
            cursor: 'pointer',
          }}>Искать</button>
        </form>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Вулканы', 'Океан', 'Медведи', 'Сёрф', 'Снегоходы', 'Вертолёт'].map((c) => (
            <span key={c} style={chipStyle}>{c}</span>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section style={sectionCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Быстрые действия</h2>
          <Link href="/search" style={{ color: '#4A90E2', fontWeight: 800 }}>Все</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
          {[
            { label: 'Каталог', href: '/partners' },
            { label: 'Поиск', href: '/search' },
            { label: 'Партнёры', href: '/partners' },
            { label: 'Календарь', href: '#' },
            { label: 'Чат', href: '#' },
            { label: 'Оплата', href: '#' },
          ].map(a => (
            <Link key={a.label} href={a.href} style={{
              border: '1px solid #e8eef5',
              borderRadius: 12,
              padding: 12,
              fontWeight: 700,
              color: '#2B6CB0',
              textAlign: 'center',
            }}>{a.label}</Link>
          ))}
        </div>
      </section>

      {/* Featured tours */}
      <section style={sectionCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Избранные туры</h2>
          <Link href="/partners" style={{ color: '#4A90E2', fontWeight: 800 }}>Каталог</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {[
            { title: 'Восхождение на вулкан', meta: 'вулканы • 4 дня', price: 'от 45 000 ₽', href: '/partners/iamkamchatka', img: 'https://via.placeholder.com/800x500?text=Volcano' },
            { title: 'Рыбалка на р. Камчатка', meta: 'рыбалка • 1–2 дня', price: 'от 12 000 ₽', href: '/partners/kr', img: 'https://via.placeholder.com/800x500?text=Fishing' },
            { title: 'Долина гейзеров', meta: 'вертолёт • 1 день', price: 'от 125 000 ₽', href: '/partners/iamkamchatka', img: 'https://via.placeholder.com/800x500?text=Geysers' },
          ].map(t => (
            <Link key={t.title} href={t.href} style={{ border: '1px solid #e8eef5', borderRadius: 12, overflow: 'hidden', color: '#1B2B3A' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.img} alt={t.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
              <div style={{ padding: 12, display: 'grid', gap: 6 }}>
                <div style={{ fontWeight: 800 }}>{t.title}</div>
                <div style={{ color: '#5C738A', fontSize: 13 }}>{t.meta}</div>
                <div style={{ color: '#2B6CB0', fontWeight: 900 }}>{t.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Safety & Alerts */}
      <section style={{ ...sectionCard, background: '#2C3E50', color: '#fff' }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Безопасность и оповещения</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
          <a href="#" style={{ background: '#4A90E2', color: '#fff', borderRadius: 12, padding: 14, fontWeight: 900, textAlign: 'center' }}>SOS</a>
          <a href="#" style={{ background: '#34495E', color: '#fff', borderRadius: 12, padding: 14, textAlign: 'center' }}>Регистрация группы (МЧС)</a>
          <a href="#" style={{ background: '#34495E', color: '#fff', borderRadius: 12, padding: 14, textAlign: 'center' }}>Сейсмика</a>
        </div>
      </section>

      {/* Bear map */}
      <section style={sectionCard}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Карта медведей</h2>
        <div style={{ background: '#F0F4FA', borderRadius: 12, height: 160, display: 'grid', placeItems: 'center', color: '#5C738A' }}>
          GeoJSON‑слой с наблюдениями — скоро
        </div>
      </section>

      {/* Partners strip */}
      <section style={sectionCard}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Наши партнёры</h2>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/partners/iamkamchatka" style={chipStyle}>IamKamchatka</Link>
          <Link href="/partners/kr" style={chipStyle}>Камчатская рыбалка</Link>
          <Link href="/partners/mestechkokam" style={chipStyle}>Местечко Кам</Link>
          <Link href="/partners" style={{ ...chipStyle, background: '#F8FAFD', color: '#1B2B3A' }}>Все партнёры</Link>
        </div>
      </section>

      {/* Promotions */}
      <section style={sectionCard}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Акции и новости</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          <div style={{ background: '#F8FAFD', border: '1px solid #e8eef5', borderRadius: 10, padding: 12, display: 'grid', gap: 6 }}>
            <div style={{ fontWeight: 800 }}>‑10% на снегоходы до 1 ноября</div>
            <div style={{ color: '#5C738A', fontSize: 13 }}>Успейте забронировать зимние приключения!</div>
          </div>
        </div>
      </section>

      {/* Referrals & eco points */}
      <section style={{ display: 'grid', gap: 16 }}>
        <div style={sectionCard}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Реферальные бусты</h2>
          <div style={{ color: '#5C738A' }}>Подключайтесь по ссылке — получайте сниженные комиссии и продвижение в каталоге</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a href="#" style={{ background: '#4A90E2', color: '#fff', borderRadius: 10, padding: '10px 14px', fontWeight: 900 }}>Стать партнёром</a>
            <a href="#" style={{ background: '#F0F4FA', color: '#2B6CB0', borderRadius: 10, padding: '10px 14px', fontWeight: 900 }}>Узнать условия</a>
          </div>
        </div>
        <div style={sectionCard}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Эко‑баллы</h2>
          <div style={{ color: '#5C738A' }}>Вывоз мусора, без пластика, бережное отношение к природе — получайте эко‑баллы и плюсы</div>
          <a href="#" style={{ background: '#E7F0FB', color: '#2B6CB0', borderRadius: 10, padding: '10px 14px', fontWeight: 900, width: 'fit-content' }}>Как это работает</a>
        </div>
      </section>
    </main>
  );
}

