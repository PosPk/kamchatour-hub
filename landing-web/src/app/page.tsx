import Link from 'next/link';
import dynamic from 'next/dynamic';
import KamchatkaButton from './components/KamchatkaButton';

export default function Page() {
  const personas = [
    { key: 'tourist', label: 'Турист', href: '/hub/tourist' },
    { key: 'operator', label: 'Туроператор', href: '/hub/operator' },
    { key: 'guide', label: 'Гид', href: '/hub/guide' },
    { key: 'transfer', label: 'Трансфер', href: '/hub/transfer' },
    { key: 'stay', label: 'Размещение', href: '/hub/stay' },
    { key: 'souvenirs', label: 'Сувениры', href: '/hub/souvenirs' },
    { key: 'gear', label: 'Прокат снаряжения', href: '/hub/gear' },
    { key: 'cars', label: 'Прокат авто', href: '/hub/cars' },
  ];
  const BearMap = dynamic(() => import('./components/BearMap'), { ssr: false });
  const KamaiWidget = dynamic(() => import('./components/KamaiWidget'), { ssr: false });
  return (
    <main className="min-h-screen bg-premium-black text-white">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-premium-gold to-premium-ice" />
          <span className="font-display text-xl tracking-tight">Kamchatour Hub</span>
        </div>
        <nav className="hidden sm:flex gap-6 text-sm text-white/70">
          <Link href="/premium" className="hover:text-white">Commerce</Link>
          <Link href="/premium2" className="hover:text-white">Adventure</Link>
          <Link href="/partners" className="hover:text-white">Партнёры</Link>
          <Link href="/search" className="hover:text-white">Поиск</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl mx-6 mb-8">
        <div className="absolute inset-0 -z-10">
          <video className="w-full h-[48vh] object-cover" autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1520496938500-76fd098ad75a?q=80&w=1920&auto=format&fit=crop">
            <source src="https://cdn.coverr.co/videos/coverr-aurora-over-mountains-0157/1080p.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 gradient-gold-aurora animate-aurora" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 p-8 grid content-end gap-4">
          <h1 className="font-display text-4xl sm:text-6xl font-black leading-tight">Экосистема туризма Камчатки</h1>
          <p className="max-w-2xl text-white/85">Туры, партнёры, CRM, бронирование, безопасность, рефералы и экология — в едином центре.</p>
          <form action="/search" className="flex gap-2 items-center">
            <input name="q" placeholder="Куда поедем? вулканы, океан, медведи…" className="flex-1 h-12 rounded-xl px-4 text-slate-900" />
            <button className="h-12 rounded-xl px-5 font-bold bg-premium-gold text-premium-black">Искать</button>
          </form>
        </div>
      </section>

      {/* Personas grid */}
      <section className="px-6 py-6 grid gap-4">
        <div className="grid gap-1 text-center">
          <div className="font-display text-3xl sm:text-5xl font-black leading-tight text-gold gold-glow">Камчатка.</div>
          <div className="font-display text-3xl sm:text-5xl font-black leading-tight text-gold gold-glow">экосистема путешествий.</div>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold">Кому это нужно</h2>
          <div className="text-white/70 text-sm">Выберите роль, чтобы продолжить</div>
        </div>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
          {personas.map(p => (
            <Link key={p.key} href={p.href} className="rounded-2xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition">
              <div className="text-lg font-extrabold">{p.label}</div>
              <div className="text-sm text-white/70">Персональные инструменты и витрины</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Ecosystem widgets */}
      <section className="px-6 py-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 grid gap-4 sm:grid-cols-2 sm:items-start">
          <div className="grid gap-4">
            <div className="text-sm text-white/70">SOS и безопасность</div>
            <div className="grid gap-3">
              <a href="#" className="rounded-xl bg-premium-gold text-premium-black text-center py-3 font-bold">SOS</a>
              <a href="#" className="rounded-xl bg-white/10 text-center py-3 font-bold">МЧС</a>
              <a href="#" className="rounded-xl bg-white/10 text-center py-3 font-bold">Сейсмика</a>
            </div>
            <div className="text-white/70 text-xs">Тестовый режим: интеграции в процессе</div>
          </div>
          <div className="w-full h-72 rounded-2xl overflow-hidden border border-white/10 bg-black grid place-items-center cursor-pointer group">
            <KamchatkaButton />
          </div>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 grid gap-2">
          <div className="text-sm text-white/70">Экология</div>
          <div className="text-2xl font-black text-premium-gold">Eco‑points: 0</div>
          <div className="text-white/70 text-sm">Собирайте баллы за бережное поведение</div>
        </div>
      </section>

      {/* Shortcuts */}
      <section className="px-6 py-8 grid gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold">Быстрые переходы</h2>
        </div>
        <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
          {[
            { label: 'Каталог туров', href: '/partners' },
            { label: 'Поиск', href: '/search' },
            { label: 'Витрина Commerce', href: '/premium' },
            { label: 'Витрина Adventure', href: '/premium2' },
            { label: 'Безопасность', href: '/hub/safety' },
            { label: 'Рефералы и бусты', href: '/hub/operator' },
          ].map(a => (
            <Link key={a.label} href={a.href} className="text-center font-semibold border border-white/10 rounded-xl p-3 bg-white/5 hover:bg-white/10">
              {a.label}
            </Link>
          ))}
        </div>
      </section>

      <KamaiWidget />
    </main>
  );
}

