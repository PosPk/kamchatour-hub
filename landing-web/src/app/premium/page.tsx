"use client";

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function PremiumCommerce() {
  const roles = [
    { k: 'tourist', label: 'Турист', href: '#tourist' },
    { k: 'operator', label: 'Туроператор', href: '#operator' },
    { k: 'guide', label: 'Гид', href: '#guide' },
    { k: 'transfer', label: 'Трансфер', href: '#transfer' },
    { k: 'stay', label: 'Размещение', href: '#stay' },
    { k: 'souvenirs', label: 'Сувениры', href: '#souvenirs' },
    { k: 'gear', label: 'Прокат снаряжения', href: '#gear' },
    { k: 'cars', label: 'Прокат авто', href: '#cars' },
  ];

  const chips = [
    'Вулканы',
    'Океан',
    'Медведи',
    'Сёрф',
    'Снегоходы',
    'Вертолёт',
  ];

  const featured = [
    {
      t: 'Восхождение на вулкан',
      m: 'вулканы • 4 дня',
      p: 'от 45 000 ₽',
      href: '/partners/iamkamchatka',
      img: 'https://images.unsplash.com/photo-1520496938500-76fd098ad75a?q=80&w=1920&auto=format&fit=crop',
    },
    {
      t: 'Рыбалка на р. Камчатка',
      m: 'рыбалка • 1–2 дня',
      p: 'от 12 000 ₽',
      href: '/partners/kr',
      img: 'https://images.unsplash.com/photo-1508171716009-c6c4516af2e3?q=80&w=1600&auto=format&fit=crop',
    },
    {
      t: 'Долина гейзеров',
      m: 'вертолёт • 1 день',
      p: 'от 125 000 ₽',
      href: '/partners/iamkamchatka',
      img: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1600&auto=format&fit=crop',
    },
  ];

  const [activeRole, setActiveRole] = useState<string>('tourist');
  const [avgOrder, setAvgOrder] = useState(45000);
  const [commission, setCommission] = useState(10);
  const [orders, setOrders] = useState(25);
  const roi = useMemo(() => {
    const revenue = (avgOrder * (commission / 100)) * orders;
    return Math.round(revenue);
  }, [avgOrder, commission, orders]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const persona = params.get('persona');
    const hash = window.location.hash?.replace('#', '');
    if (persona) setActiveRole(persona);
    else if (hash && ['tourist','operator','guide','transfer','stay','souvenirs','gear','cars'].includes(hash)) setActiveRole(hash);
  }, []);

  return (
    <main className="min-h-screen bg-premium-black text-white">
      {/* Sticky persona header */}
      <div className="sticky top-0 z-40 bg-black/75 backdrop-blur border-b border-white/10">
        <header className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-premium-gold to-premium-ice animate-float" />
            <span className="font-display text-xl tracking-tight">Kamchatour Hub</span>
          </div>
          <nav className="hidden sm:flex gap-6 text-sm text-white/70">
            <Link href="/partners" className="hover:text-white">Партнёры</Link>
            <Link href="/search" className="hover:text-white">Поиск</Link>
            <a href="#safety" className="hover:text-white">Безопасность</a>
          </nav>
          <a href="#partner-cta" className="rounded-xl bg-premium-gold text-premium-black px-4 py-2 font-semibold hover:brightness-110">Стать партнёром</a>
        </header>
        {/* Role switcher */
        }
        <div className="px-6 pb-3 overflow-x-auto no-scrollbar">
          <div className="flex gap-2">
            {roles.map(r => (
              <a
                key={r.k}
                href={r.href}
                onClick={(e) => { e.preventDefault(); setActiveRole(r.k); const el = document.getElementById(r.k); el?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                className={`px-3 py-2 rounded-full text-sm whitespace-nowrap ${activeRole===r.k ? 'bg-premium-gold text-premium-black' : 'bg-white/10 hover:bg-white/15'}`}
              >
                {r.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Cinematic Hero: fullscreen video, aurora overlay, parallax */}
      <section className="relative overflow-hidden rounded-3xl mx-6 mb-8">
        <div className="absolute inset-0 -z-10">
          <video className="w-full h-[62vh] object-cover" autoPlay muted loop playsInline poster={featured[0].img}>
            <source src="https://cdn.coverr.co/videos/coverr-aurora-over-mountains-0157/1080p.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 gradient-gold-aurora animate-aurora" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 p-8 grid content-end gap-4">
          <h1 className="font-display text-4xl sm:text-6xl font-black leading-tight text-gold-gradient">
            Камчатка. Премиум‑экосистема путешествий
          </h1>
          <p className="max-w-2xl text-white/85">
            Коммерческие витрины, CRM, календарь ресурсов, онлайн‑бронь, рефералы и безопасность —
            в одном месте. Монетизация и контроль для партнёров.
          </p>
          <form action="/search" className="flex gap-2 items-center">
            <input
              name="q"
              placeholder="Куда поедем? вулканы, океан, медведи…"
              className="flex-1 h-12 rounded-xl px-4 text-slate-900"
            />
            <button className="h-12 rounded-xl px-5 font-bold bg-premium-gold text-premium-black">
              Искать
            </button>
          </form>
          <div className="flex gap-2 flex-wrap">
            {chips.map(c => (
              <span key={c} className="px-3 py-2 bg-white/15 backdrop-blur rounded-full text-sm font-semibold">
                {c}
              </span>
            ))}
          </div>
        </div>
        {/* Scroll progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div className="h-full bg-premium-gold" style={{ width: '30%' }} />
        </div>
      </section>

      {/* Trust */}
      <section className="px-6 py-4 grid gap-3" id="tourist">
        <div className="text-sm text-white/70">Нам доверяют</div>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-white/5 border border-white/10" />
          ))}
        </div>
      </section>

      {/* Partner value & live stats (shown when role = Туроператор) */}
      <section id="operator" className="px-6 py-6 grid gap-6">
        {activeRole === 'operator' && (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <div className="text-premium-gold font-bold text-sm">Монетизация</div>
                <div className="text-xl font-extrabold">Онлайн‑бронь и автоплатежи</div>
                <div className="text-white/80 text-sm">Авторизация/капча платежей, холд/капчер CloudPayments.</div>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <div className="text-premium-gold font-bold text-sm">Операции</div>
                <div className="text-xl font-extrabold">Автоперераспределение ресурсов</div>
                <div className="text-white/80 text-sm">Гиды, транспорт, размещение — оптимизация при погодных рисках.</div>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <div className="text-premium-gold font-bold text-sm">Рефералы</div>
                <div className="text-xl font-extrabold">Бусты и eco‑баллы</div>
                <div className="text-white/80 text-sm">Лояльность и бонусы за экологичность.</div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 grid gap-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="font-extrabold text-2xl">Калькулятор партнёра</div>
                <div className="text-white/70 text-sm">Оцените ежемесячный доход от бронирований</div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid gap-1">
                  <label className="text-sm text-white/70">Средний чек, ₽</label>
                  <input type="number" value={avgOrder} onChange={e => setAvgOrder(Number(e.target.value) || 0)} className="h-11 rounded-lg px-3 text-slate-900" />
                </div>
                <div className="grid gap-1">
                  <label className="text-sm text-white/70">Комиссия, %</label>
                  <input type="number" value={commission} onChange={e => setCommission(Number(e.target.value) || 0)} className="h-11 rounded-lg px-3 text-slate-900" />
                </div>
                <div className="grid gap-1">
                  <label className="text-sm text-white/70">Число заказов / мес</label>
                  <input type="number" value={orders} onChange={e => setOrders(Number(e.target.value) || 0)} className="h-11 rounded-lg px-3 text-slate-900" />
                </div>
              </div>
              <div className="rounded-xl bg-black/40 border border-white/10 p-5">
                <div className="text-sm text-white/70">Потенциальный доход (комиссии)</div>
                <div className="text-3xl font-black text-premium-gold">{roi.toLocaleString('ru-RU')} ₽ / мес</div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* How we earn: прозрачная монетизация 5–12% */}
      <section className="px-6 py-6 grid gap-3" id="pricing">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 grid gap-3">
          <div className="text-sm text-white/70">Как мы зарабатываем</div>
          <div className="text-xl font-extrabold">Комиссия только за успешную бронь</div>
          <ul className="text-white/85 text-sm grid gap-2 list-disc pl-5">
            <li>5–12% с успешной брони — ставка зависит от рейтинга партнёра</li>
            <li>Для туриста — без наценки: цена идентична цене туроператора</li>
            <li>Дополнительные услуги: страховки, предзаказы питания, прокат авто/снаряжения — по выбору</li>
            <li>Реферальные программы и бусты — прозрачная отчётность в кабинете</li>
          </ul>
          <div className="flex gap-3 pt-1">
            <a href="/partners" className="rounded-xl bg-premium-gold text-premium-black px-5 py-3 font-bold">Стать партнёром</a>
            <a href="/operator-web/login" className="rounded-xl bg-white/10 text-white px-5 py-3 font-bold">Кабинет партнёра</a>
          </div>
        </div>
      </section>

      {/* Featured cards (glass + shine + parallax hint) */}
      <section className="px-6 py-8 grid gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold">Избранные туры</h2>
          <Link className="text-premium-gold font-bold" href="/partners">Каталог</Link>
        </div>
        {/* Mobile carousel */}
        <div className="sm:hidden">
          <Carousel
            items={featured.slice(1).map(f => ({ href: f.href, img: f.img, title: f.t, meta: f.m, price: f.p }))}
          />
        </div>
        {/* Desktop grid */}
        <div className="hidden sm:grid gap-4 grid-cols-1 sm:grid-cols-3 perspective-1000">
          {featured.slice(1).map(f => (
            <TiltCard key={f.t} href={f.href} img={f.img} title={f.t} meta={f.m} price={f.p} />
          ))}
        </div>
      </section>

      {/* Safety */}
      <section id="safety" className="px-6 py-8">
        <div className="rounded-2xl bg-gradient-to-br from-premium-ice/15 to-premium-gold/15 border border-white/10 text-white p-6 grid gap-3">
          <h3 className="text-xl font-extrabold">Безопасность и поддержка</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <a href="#" className="rounded-xl bg-premium-gold text-premium-black text-center py-3 font-bold">SOS</a>
            <a href="#" className="rounded-xl bg-white/10 text-center py-3 font-bold">Регистрация группы (МЧС)</a>
            <a href="#" className="rounded-xl bg-white/10 text-center py-3 font-bold">Сейсмика</a>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer id="partner-cta" className="px-6 py-10 grid gap-3">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 grid gap-4 text-center">
          <div className="text-2xl font-extrabold">Готовы подключиться как партнёр?</div>
          <div className="text-white/80">Витрина, CRM, календарь ресурсов, рефералы и безопасность — всё в одном месте.</div>
          <div className="flex gap-3 justify-center">
            <a href="#" className="rounded-xl bg-premium-gold text-premium-black px-5 py-3 font-bold">Стать партнёром</a>
            <a href="#" className="rounded-xl bg-white/10 text-white px-5 py-3 font-bold">Узнать условия</a>
          </div>
        </div>
      </footer>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-3 left-0 right-0 px-4">
        <div className="mx-auto max-w-md rounded-2xl bg-black/60 backdrop-blur border border-white/10 text-sm grid grid-cols-5 overflow-hidden">
          {[
            { t: 'Главная', href: '/' },
            { t: 'Каталог', href: '/v1' },
            { t: 'Карта', href: '/v2' },
            { t: 'SOS', href: '#safety' },
            { t: 'Профиль', href: '/v3' },
          ].map(i => (
            <a key={i.t} href={i.href} className="text-center py-3 hover:bg-white/5">{i.t}</a>
          ))}
        </div>
      </nav>
    </main>
  );
}

function TiltCard({ href, img, title, meta, price, className }: { href: string; img: string; title: string; meta: string; price: string; className?: string }) {
  return (
    <Link href={href} className={`group relative premium-card rounded-2xl overflow-hidden transition will-change-transform ${className || ''}`} style={{ transform: 'rotateX(0deg) rotateY(0deg)' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img} alt={title} className="w-full h-48 object-cover group-hover:scale-[1.03] transition" />
      <div className="absolute inset-0 gold-shine animate-shine opacity-0 group-hover:opacity-40 transition" />
      <div className="relative p-4 grid gap-1">
        <div className="font-extrabold">{title}</div>
        <div className="text-sm text-white/70">{meta}</div>
        <div className="text-premium-gold font-black">{price}</div>
      </div>
    </Link>
  );
}

type CarouselItem = { href: string; img: string; title: string; meta: string; price: string };
function Carousel({ items }: { items: CarouselItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const delta = Math.max(280, Math.floor(el.clientWidth * 0.85));
    el.scrollBy({ left: dir * delta, behavior: 'smooth' });
  };
  return (
    <div className="relative">
      <div ref={trackRef} className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 px-1">
        {items.map((i) => (
          <div key={i.title} className="min-w-[280px] snap-start">
            <TiltCard {...i} className="w-[280px]" />
          </div>
        ))}
      </div>
      <button aria-label="prev" onClick={() => scrollBy(-1)} className="hidden sm:grid place-items-center absolute -left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/60 border border-white/10">‹</button>
      <button aria-label="next" onClick={() => scrollBy(1)} className="hidden sm:grid place-items-center absolute -right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/60 border border-white/10">›</button>
    </div>
  );
}

