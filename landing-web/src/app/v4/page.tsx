export default function V4() {
  return (
    <main className="px-6 py-8 grid gap-6">
      <section className="relative rounded-2xl overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://via.placeholder.com/1600x700?text=Hero" alt="Hero" className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 p-6 text-white grid content-end gap-2">
          <h1 className="text-3xl font-extrabold">Kamchatour Hub</h1>
          <p className="opacity-90">Маркетплейс туров и безопасные приключения</p>
        </div>
      </section>
      <section className="grid gap-3 sm:grid-cols-3">
        {["Туры","Безопасность","Партнёры"].map(x => (
          <a key={x} href="#" className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm text-center font-extrabold">{x}</a>
        ))}
      </section>
    </main>
  );
}

