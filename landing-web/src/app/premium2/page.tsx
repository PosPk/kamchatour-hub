"use client";

import Link from 'next/link';

export default function PremiumAdventure() {
  const hero = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1920&auto=format&fit=crop';
  const cards = [
    {
      t: 'Дикие медведи и шельф',
      m: 'экспедиция • 3 дня',
      p: 'от 89 000 ₽',
      href: '/partners/iamkamchatka',
      img: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=1400&auto=format&fit=crop',
    },
    {
      t: 'Вулканический треккинг',
      m: 'альпинизм • 2 дня',
      p: 'от 38 000 ₽',
      href: '/partners/iamkamchatka',
      img: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=1400&auto=format&fit=crop',
    },
    {
      t: 'Хели-дроп к кальдере',
      m: 'вертолёт • 1 день',
      p: 'от 190 000 ₽',
      href: '/partners/iamkamchatka',
      img: 'https://images.unsplash.com/photo-1526483360412-f4dbaf036963?q=80&w=1400&auto=format&fit=crop',
    },
  ];

  return (
    <main className="min-h-screen bg-adventure-deep text-white">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-adventure-neon" />
          <span className="font-accent text-xl tracking-wide">KAMCHATOUR</span>
        </div>
        <nav className="hidden sm:flex gap-6 text-sm text-white/70">
          <Link href="/partners" className="hover:text-white">Партнёры</Link>
          <Link href="/search" className="hover:text-white">Поиск</Link>
          <a href="#safety" className="hover:text-white">Безопасность</a>
        </nav>
        <a href="#" className="rounded-xl bg-adventure-neon text-adventure-deep px-4 py-2 font-semibold hover:brightness-110">Забронировать</a>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl mx-6 mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={hero} alt="Adventure" className="w-full h-[64vh] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-adventure-deep via-adventure-deep/40 to-transparent" />
        <div className="absolute inset-0 p-6 sm:p-10 grid content-end gap-4">
          <h1 className="font-accent text-5xl sm:text-7xl tracking-tight">
            Экстрим Камчатки
          </h1>
          <p className="max-w-2xl text-white/85">
            Вулканы, ледники, медведи. Готовые экспедиции и кастомные маршруты с гидами.
          </p>
          <div className="flex gap-3 flex-wrap">
            {['Экспедиции', 'Альпинизм', 'Сёрф', 'Хели‑ски'].map(x => (
              <span key={x} className="px-3 py-2 rounded-full bg-white/10 border border-white/10 text-sm">
                {x}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="px-6 grid gap-4 sm:grid-cols-3">
        {cards.map(c => (
          <Link key={c.t} href={c.href} className="group rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:translate-y-[-2px] transition">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.img} alt={c.t} className="w-full h-48 object-cover group-hover:scale-[1.02] transition" />
            <div className="p-4 grid gap-1">
              <div className="font-extrabold">{c.t}</div>
              <div className="text-white/70 text-sm">{c.m}</div>
              <div className="text-adventure-neon font-black">{c.p}</div>
            </div>
          </Link>
        ))}
      </section>

      {/* Safety */}
      <section id="safety" className="px-6 py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          <a href="#" className="rounded-2xl bg-adventure-neon text-adventure-deep text-center py-4 font-bold">SOS</a>
          <a href="#" className="rounded-2xl bg-white/5 border border-white/10 text-center py-4 font-bold">Регистрация группы</a>
          <a href="#" className="rounded-2xl bg-white/5 border border-white/10 text-center py-4 font-bold">Сейсмика Live</a>
        </div>
      </section>
    </main>
  );
}

