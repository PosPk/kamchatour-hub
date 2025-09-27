export default function V2() {
  return (
    <main className="px-6 py-8 grid gap-6">
      <section className="rounded-2xl bg-slate-900 text-white p-6 grid gap-3">
        <h1 className="text-3xl font-extrabold">Экосистема туров Камчатки</h1>
        <p className="opacity-80">Маршруты, оплата, безопасность, офлайн — готово к сезону</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {["Каталог","Партнёры","Безопасность"].map(x => (
            <a key={x} href="#" className="text-center rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold">{x}</a>
          ))}
        </div>
      </section>
      <section className="grid gap-3 sm:grid-cols-3">
        {["Вулканы","Медведи","Океан"].map(x => (
          <div key={x} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="font-extrabold mb-1">{x}</div>
            <div className="text-sm text-slate-500">Подборка туров</div>
          </div>
        ))}
      </section>
    </main>
  );
}

