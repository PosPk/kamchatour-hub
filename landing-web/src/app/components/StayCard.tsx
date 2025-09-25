import Link from 'next/link';

export type StayItem = {
  id: string;
  title: string;
  location: string;
  rating: number;
  reviews?: number;
  priceFrom: number;
  img: string;
  badge?: string;
  summary?: string;
};

export default function StayCard({ item }: { item: StayItem }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-premium-gold/50 transition">
      <div className="grid grid-cols-1 sm:grid-cols-[240px_1fr]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.img} alt={item.title} className="w-full h-48 sm:h-44 object-cover" loading="lazy" />
        <div className="p-4 grid gap-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-lg">{item.title}</h3>
              <div className="text-white/70 text-sm">{item.location}</div>
            </div>
            <div className="rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-center">
              <div className="text-xl font-black text-premium-gold">{item.rating.toFixed(1)}</div>
              <div className="text-xs text-white/70">{item.reviews ? `${item.reviews} отзывов` : '—'}</div>
            </div>
          </div>
          {item.summary && <div className="text-sm text-white/80">{item.summary}</div>}
          <div className="flex items-center justify-between pt-2">
            <div className="text-white/85"><span className="text-2xl font-black text-premium-gold">{item.priceFrom.toLocaleString('ru-RU')}</span> ₽ / ночь</div>
            <div className="flex gap-2">
              <Link href={`/hub/stay/${item.id}`} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 font-semibold">Подробнее</Link>
              <Link href={`/hub/stay/${item.id}`} className="px-4 py-2 rounded-lg bg-premium-gold text-premium-black font-semibold">Забронировать</Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

