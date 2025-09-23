import Link from 'next/link';

export default function Page() {
  return (
    <main className="px-6 py-8 grid gap-6">
      <section className="rounded-2xl bg-gradient-to-br from-blue-400 to-blue-700 text-white p-6 grid gap-3">
        <h1 className="text-3xl font-extrabold">Камчатка — ближе, чем кажется</h1>
        <p className="opacity-90">Туры, партнёры, бронирование и поддержка — в одном месте</p>
        <form action="/search" className="flex gap-2 items-center">
          <input name="q" placeholder="Куда поедем? вулканы, океан, медведи…" className="flex-1 h-11 rounded-lg px-3 text-slate-900" />
          <button className="h-11 rounded-lg px-4 font-bold bg-white text-blue-700">Искать</button>
        </form>
        <div className="flex gap-2 flex-wrap">
          {["Вулканы","Океан","Медведи","Сёрф","Снегоходы","Вертолёт"].map(c => (
            <span key={c} className="px-3 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">{c}</span>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 grid gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Быстрые действия</h2>
          <Link className="text-blue-600 font-bold" href="/search">Все</Link>
        </div>
        <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(140px,1fr))]">
          {[
            { label: 'Каталог', href: '/partners' },
            { label: 'Поиск', href: '/search' },
            { label: 'Партнёры', href: '/partners' },
            { label: 'Календарь', href: '#' },
            { label: 'Чат', href: '#' },
            { label: 'Оплата', href: '#' },
          ].map(a => (
            <Link key={a.label} href={a.href} className="text-center font-semibold text-blue-700 border border-slate-200 rounded-xl p-3 bg-white hover:shadow">
              {a.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

