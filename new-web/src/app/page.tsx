import Link from 'next/link';

export default function Page() {
  return (
    <main className="container">
      <section className="hero">
        <div className="hero__title">Камчатка — ближе, чем кажется</div>
        <div className="hero__subtitle">Туры, партнёры, бронирование и поддержка — в одном месте</div>
        <form action="/search" className="hero__search">
          <input name="q" placeholder="Куда поедем? вулканы, океан, медведи…" className="input" />
          <button type="submit" className="btn btn--primary">Искать</button>
        </form>
        <div className="chips">
          {['Вулканы', 'Океан', 'Медведи', 'Сёрф', 'Снегоходы', 'Вертолёт'].map(c => (
            <span key={c} className="chip">{c}</span>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section__header">
          <h2 className="section__title">Быстрые действия</h2>
          <Link className="link" href="/search">Все</Link>
        </div>
        <div className="grid-quick">
          {[
            { label: 'Каталог', href: '/partners' },
            { label: 'Поиск', href: '/search' },
            { label: 'Партнёры', href: '/partners' },
            { label: 'Календарь', href: '#' },
            { label: 'Чат', href: '#' },
            { label: 'Оплата', href: '#' },
          ].map(a => (
            <Link key={a.label} href={a.href} className="tile">{a.label}</Link>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section__header">
          <h2 className="section__title">Избранные туры</h2>
          <Link className="link" href="/partners">Каталог</Link>
        </div>
        <div className="grid-cards">
          {[
            { title: 'Восхождение на вулкан', meta: 'вулканы • 4 дня', price: 'от 45 000 ₽', href: '/partners/iamkamchatka', img: 'https://via.placeholder.com/800x500?text=Volcano' },
            { title: 'Рыбалка на р. Камчатка', meta: 'рыбалка • 1–2 дня', price: 'от 12 000 ₽', href: '/partners/kr', img: 'https://via.placeholder.com/800x500?text=Fishing' },
            { title: 'Долина гейзеров', meta: 'вертолёт • 1 день', price: 'от 125 000 ₽', href: '/partners/iamkamchatka', img: 'https://via.placeholder.com/800x500?text=Geysers' },
          ].map(t => (
            <Link key={t.title} href={t.href} className="card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.img} alt={t.title} className="card__img" />
              <div className="card__body">
                <div className="card__title">{t.title}</div>
                <div className="card__meta">{t.meta}</div>
                <div className="card__price">{t.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="banner--dark">
        <h2 className="section__title">Безопасность и оповещения</h2>
        <div className="banner__grid">
          <a href="#" className="btn--cta">SOS</a>
          <a href="#" className="btn--ghost">Регистрация группы (МЧС)</a>
          <a href="#" className="btn--ghost">Сейсмика</a>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section__title">Карта медведей</h2>
        <div className="map-placeholder">GeoJSON‑слой с наблюдениями — скоро</div>
      </section>

      <section className="section-card">
        <h2 className="section__title">Наши партнёры</h2>
        <div className="partners">
          <Link className="chip" href="/partners/iamkamchatka">IamKamchatka</Link>
          <Link className="chip" href="/partners/kr">Камчатская рыбалка</Link>
          <Link className="chip" href="/partners/mestechkokam">Местечко Кам</Link>
          <Link className="chip" href="/partners">Все партнёры</Link>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section__title">Акции и новости</h2>
        <div className="stack">
          <div className="section-card" style={{ boxShadow: 'none' }}>
            <div style={{ fontWeight: 800 }}>‑10% на снегоходы до 1 ноября</div>
            <div className="card__meta">Успейте забронировать зимние приключения!</div>
          </div>
        </div>
      </section>

      <section className="stack">
        <div className="section-card">
          <h2 className="section__title">Реферальные бусты</h2>
          <div className="card__meta">Подключайтесь по ссылке — получайте сниженные комиссии и продвижение в каталоге</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a href="#" className="btn--cta" style={{ height: 'auto' }}>Стать партнёром</a>
            <a href="#" className="btn--link">Узнать условия</a>
          </div>
        </div>
        <div className="section-card">
          <h2 className="section__title">Эко‑баллы</h2>
          <div className="card__meta">Вывоз мусора, без пластика, бережное отношение к природе — получайте эко‑баллы и плюсы</div>
          <a href="#" className="btn--link">Как это работает</a>
        </div>
      </section>
    </main>
  );
}

