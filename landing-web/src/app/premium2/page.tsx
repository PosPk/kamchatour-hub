export default function Premium2() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 px-6 py-8 grid gap-6">
      <section className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm grid gap-2">
        <h1 className="text-4xl font-extrabold">Kamchatour VIP</h1>
        <p className="text-slate-600">Экосистема премиум‑уровня: туры, безопасность и поддержка</p>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white border border-slate-200 shadow-sm h-48" />
        ))}
      </section>
    </main>
  );
}

