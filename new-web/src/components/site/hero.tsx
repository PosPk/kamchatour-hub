export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_30%_at_30%_20%,oklch(0.88_0.06_260)_0%,transparent_60%),radial-gradient(40%_30%_at_70%_30%,oklch(0.95_0.06_100)_0%,transparent_60%)] opacity-60" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          Путешествия, которые хочется повторять
        </h1>
        <p className="mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground">
          Подборка лучших маршрутов: цена, дни, операторы — всё прозрачно. Забронируйте за минуты.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#tours" className="inline-flex h-10 items-center rounded-md bg-foreground text-background px-5 text-sm font-medium hover:opacity-90">
            Смотреть туры
          </a>
          <a href="#trust" className="inline-flex h-10 items-center rounded-md border px-5 text-sm font-medium hover:bg-muted">
            Почему мы
          </a>
        </div>
      </div>
    </section>
  );
}

