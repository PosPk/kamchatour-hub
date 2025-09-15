import fs from 'node:fs/promises';
import path from 'node:path';
import { Navbar } from "@/components/site/navbar";
import { TourCard } from "@/components/site/tour-card";

export const dynamic = 'force-static';

type Tour = {
  id: string;
  title: string;
  image?: string | null;
  activity?: string | null;
  region?: string | null;
  price_from?: number | null;
  duration_days?: number | null;
};

async function getTours(): Promise<Tour[]> {
  try {
    const file = path.join(process.cwd(), 'public', 'partner-tours.json');
    const raw = await fs.readFile(file, 'utf8');
    const dataUnknown = JSON.parse(raw) as unknown;
    if (Array.isArray(dataUnknown)) {
      const coerceTour = (input: unknown): Tour | null => {
        if (!input || typeof input !== 'object') return null;
        const obj = input as Record<string, unknown>;
        const id = typeof obj.id === 'string' ? obj.id : '';
        const title = typeof obj.title === 'string' ? obj.title : '';
        if (!id || !title) return null;
        const image = typeof obj.image === 'string' ? obj.image : null;
        const activity = typeof obj.activity === 'string' ? obj.activity : null;
        const region = typeof obj.region === 'string' ? obj.region : null;
        const price_from = typeof obj.price_from === 'number' ? obj.price_from : null;
        const duration_days = typeof obj.duration_days === 'number' ? obj.duration_days : null;
        return { id, title, image, activity, region, price_from, duration_days };
      };
      return dataUnknown.map(coerceTour).filter((t): t is Tour => Boolean(t));
    }
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
          {tours.map((t: Tour) => (
            <TourCard
              key={t.id}
              title={t.title}
              days={t.duration_days ?? 1}
              price={`от ${new Intl.NumberFormat('ru-RU').format(t.price_from ?? 0)}₽`}
              image={t.image || '/images/sample-1.jpg'}
              badges={[t.activity || 'тур', t.region || ''].filter(Boolean) as string[]}
            />
          ))}
        </section>
      </main>
    </div>
  );
}