export default function V3() {
  return (
    <main className="px-6 py-8 grid gap-6">
      <section className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm grid gap-3">
        <h1 className="text-3xl font-extrabold text-slate-900">Найдите свой маршрут</h1>
        <p className="text-slate-600">Подбор по сезонности, сложности, активности</p>
        <div className="flex gap-2 flex-wrap">
          {["Лёгкий","Средний","Сложный","Семейный","1 день","3–5 дней"].map(x => (
            <a key={x} href="#" className="px-3 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold">{x}</a>
          ))}
        </div>
      </section>
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm h-40" />
        ))}
      </section>
    </main>
  );
}

