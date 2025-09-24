"use client";

import Link from 'next/link';

export default function PremiumAdventure() {
  const hero = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1920&auto=format&fit=crop';
  const mosaic = [
    'https://images.unsplash.com/photo-1526483360412-f4dbaf036963?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
  ];

  return (
    <main className="min-h-screen bg-adventure-deep text-white relative">
      {/* Sticky role switcher */}
      <div className="sticky top-0 z-40 bg-adventure-deep/85 backdrop-blur border-b border-white/10">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg gradient-neon animate-pulseGlow" />
            <span className="font-accent text-xl tracking-wide">KAMCHATOUR</span>
          </div>
          <div className="no-scrollbar overflow-x-auto">
            <div className="flex gap-2">
              {['Турист','Туроператор','Гид','Трансфер','Размещение','Сувениры','Снаряжение','Авто'].map(x => (
                <a key={x} href="#" className="px-3 py-2 rounded-full bg-white/10 text-sm hover:bg-white/15 whitespace-nowrap">
                  {x}
                </a>
              ))}
            </div>
          </div>
          <a href="#book" className="rounded-xl bg-adventure-neon text-adventure-deep px-4 py-2 font-semibold hover:brightness-110">Забронировать</a>
        </div>
      </div>

      {/* Cinematic hero with aurora overlay */}
      <section className="relative overflow-hidden rounded-b-3xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={hero} alt="Adventure" className="w-full h-[68vh] object-cover" />
        <div className="absolute inset-0 gradient-aurora animate-aurora" />
        <div className="absolute inset-0 bg-gradient-to-t from-adventure-deep via-adventure-deep/30 to-transparent" />
        <div className="absolute inset-0 p-6 sm:p-12 grid content-end gap-5">
          <h1 className="font-accent text-5xl sm:text-7xl tracking-tight">Экстрим Камчатки</h1>
          <p className="max-w-2xl text-white/85">Вулканы, ледники, медведи. Экспедиции и кастом‑маршруты с гидами и поддержкой.</p>
          <div className="flex gap-3 flex-wrap">
            {['Экспедиции','Альпинизм','Сёрф','Хели‑ски'].map(x => (
              <span key={x} className="px-3 py-2 rounded-full bg-white/10 border border-white/10 text-sm">{x}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Live seismic bar + eco ring */}
      <section className="px-6 py-8 grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 grid gap-3 sm:col-span-2">
          <div className="text-white/70 text-sm">Сейсмический мониторинг (live)</div>
          <div className="h-3 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-2/3 bg-adventure-neon animate-shake" />
          </div>
          <div className="text-white/70 text-xs">Источник: Yandex Data + локальные датчики</div>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 grid place-items-center">
          <div className="relative h-28 w-28 rounded-full grid place-items-center" style={{ boxShadow: 'inset 0 0 0 10px rgba(255,255,255,0.08)' }}>
            <div className="absolute inset-0 rounded-full" style={{ boxShadow: 'inset 0 0 0 10px #FF6B35' }} />
            <div className="text-center">
              <div className="text-xl font-black">78</div>
              <div className="text-xs text-white/70">eco‑points</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mosaic cards (non‑grid look) */}
      <section className="px-6 grid gap-4">
        <div className="grid grid-cols-12 gap-4">
          <Mosaic img={mosaic[0]} className="col-span-12 sm:col-span-7 h-60" />
          <Mosaic img={mosaic[1]} className="col-span-12 sm:col-span-5 h-60" />
          <Mosaic img={mosaic[2]} className="col-span-12 sm:col-span-5 h-60" />
          <Mosaic img={mosaic[3]} className="col-span-12 sm:col-span-7 h-60" />
        </div>
      </section>

      {/* Safety actions */}
      <section id="safety" className="px-6 py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          <a href="#" className="rounded-2xl bg-adventure-neon text-adventure-deep text-center py-4 font-bold animate-pulseGlow">SOS</a>
          <a href="#" className="rounded-2xl bg-white/5 border border-white/10 text-center py-4 font-bold">Регистрация группы</a>
          <a href="#" className="rounded-2xl bg-white/5 border border-white/10 text-center py-4 font-bold">Сейсмика Live</a>
        </div>
      </section>

      {/* Distinct bottom nav */}
      <nav className="fixed bottom-4 left-0 right-0 px-5">
        <div className="mx-auto max-w-md rounded-2xl bg-black/60 backdrop-blur border border-white/10 text-sm grid grid-cols-5 overflow-hidden">
          {[
            { t: 'Главная', href: '/' },
            { t: 'Маршруты', href: '/v4' },
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

function Mosaic({ img, className }: { img: string; className?: string }) {
  return (
    <div className={`relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 ${className || ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-adventure-deep/70 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <div className="text-sm text-white/85">Приключения</div>
        <a href="#book" className="px-3 py-1.5 rounded-lg bg-adventure-neon text-adventure-deep text-xs font-bold">Забронировать</a>
      </div>
    </div>
  );
}

