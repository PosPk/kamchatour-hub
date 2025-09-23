import Link from 'next/link';

export default function Premium() {
  const chips = ["Вулканы","Океан","Медведи","Сёрф","Снегоходы","Вертолёт"];
  const featured = [
    { t: 'Восхождение на вулкан', m: 'вулканы • 4 дня', p: 'от 45 000 ₽', href: '/partners/iamkamchatka', img: 'https://via.placeholder.com/1600x800?text=VIP+Hero' },
    { t: 'Рыбалка на р. Камчатка', m: 'рыбалка • 1–2 дня', p: 'от 12 000 ₽', href: '/partners/kr', img: 'https://via.placeholder.com/1200x600?text=VIP+Card+1' },
    { t: 'Долина гейзеров', m: 'вертолёт • 1 день', p: 'от 125 000 ₽', href: '/partners/iamkamchatka', img: 'https://via.placeholder.com/1200x600?text=VIP+Card+2' },
  ];
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-600" />
          <span className="font-extrabold tracking-tight">Kamchatour Hub</span>
        </div>
        <nav className="hidden sm:flex gap-6 text-sm text-slate-600">
          <Link href="/partners" className="hover:text-slate-900">Партнёры</Link>
          <Link href="/search" className="hover:text-slate-900">Поиск</Link>
          <a href="#safety" className="hover:text-slate-900">Безопасность</a>
        </nav>
        <a href="#" className="rounded-xl bg-blue-600 text-white px-4 py-2 font-semibold">Стать партнёром</a>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl mx-6 mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={featured[0].img} alt="VIP Hero" className="w-full h-[56vh] object-cover" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 p-8 grid content-end gap-3 text-white">
          <h1 className="text-4xl sm:text-5xl font-extrabold">Камчатка — премиальные приключения</h1>
          <p className="opacity-95 max-w-2xl">Маршруты к вулканам, океану и гейзерам. Партнёры‑профессионалы, безопасность, офлайн‑поддержка.</p>
          <form action="/search" className="flex gap-2 items-center">
            <input name="q" placeholder="Куда поедем? вулканы, океан, медведи…" className="flex-1 h-12 rounded-xl px-4 text-slate-900" />
            <button className="h-12 rounded-xl px-5 font-bold bg-white text-blue-700">Искать</button>
          </form>
          <div className="flex gap-2 flex-wrap">
            {chips.map(c => <span key={c} className="px-3 py-2 bg-white/20 backdrop-blur text-white rounded-full text-sm font-semibold">{c}</span>)}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="px-6 py-4 grid gap-3">
        <div className="text-sm text-slate-500">Нам доверяют</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-white border border-slate-200 shadow-sm" />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 py-4 grid gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold">Категории</h2>
          <Link href="/search" className="text-blue-700 font-bold">Все</Link>
        </div>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
          {chips.slice(0,4).map(x => (
            <a key={x} href="#" className="aspect-video rounded-xl bg-white border border-slate-200 shadow-sm grid place-content-center font-extrabold text-slate-800">{x}</a>
          ))}
        </div>
      </section>

      {/* Featured cards */}
      <section className="px-6 py-4 grid gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold">Избранные туры</h2>
          <Link className="text-blue-700 font-bold" href="/partners">Каталог</Link>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          {featured.slice(1).map(f => (
            <Link key={f.t} href={f.href} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.img} alt={f.t} className="w-full h-44 object-cover" />
              <div className="p-4 grid gap-1">
                <div className="font-extrabold">{f.t}</div>
                <div className="text-sm text-slate-500">{f.m}</div>
                <div className="text-blue-700 font-black">{f.p}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Safety */}
      <section id="safety" className="px-6 py-8">
        <div className="rounded-2xl bg-slate-900 text-white p-6 grid gap-3">
          <h3 className="text-xl font-extrabold">Безопасность и поддержка</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <a href="#" className="rounded-xl bg-blue-600 hover:bg-blue-500 text-center py-3 font-bold">SOS</a>
            <a href="#" className="rounded-xl bg-white/10 text-center py-3 font-bold">Регистрация группы (МЧС)</a>
            <a href="#" className="rounded-xl bg-white/10 text-center py-3 font-bold">Сейсмика</a>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="px-6 py-10 grid gap-3">
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm grid gap-4 text-center">
          <div className="text-2xl font-extrabold">Готовы подключиться как партнёр?</div>
          <div className="text-slate-600">Витрина, CRM, календарь ресурсов, рефералы и безопасность — всё в одном месте.</div>
          <div className="flex gap-3 justify-center">
            <a href="#" className="rounded-xl bg-blue-600 text-white px-5 py-3 font-bold">Стать партнёром</a>
            <a href="#" className="rounded-xl bg-slate-100 text-slate-900 px-5 py-3 font-bold">Узнать условия</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

