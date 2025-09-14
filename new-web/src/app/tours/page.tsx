import fs from 'node:fs/promises';
import path from 'node:path';
import { Navbar } from "@/components/site/navbar";
import { TourCard } from "@/components/site/tour-card";

export const dynamic = 'force-static';

async function getTours() {
  try {
    const file = path.join(process.cwd(), 'public', 'partner-tours.json');
    const raw = await fs.readFile(file, 'utf8');
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return data as Array<any>;
    return [];
  } catch {
    return [];
  }
}

export default async function ToursPage() {
  const tours = await getTours();
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <h1 className="text-2xl font-semibold tracking-tight">Каталог туров</h1>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((t) => (
            <TourCard key={t.id} title={t.title} days={t.duration_days || 1} price={`от ${new Intl.NumberFormat('ru-RU').format(t.price_from || 0)}₽`} image={t.image || '/images/sample-1.jpg'} badges={[t.activity || 'тур', t.region || '']} />
          ))}
        </section>
      </main>
    </div>
  );
}