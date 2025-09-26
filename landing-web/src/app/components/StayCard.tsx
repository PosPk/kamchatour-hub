import Link from 'next/link';
import { useMemo, useState } from 'react';

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

function Stars({ n }: { n: number }) {
  const arr = new Array(5).fill(0).map((_,i)=>i < n);
  return (
    <div className="flex gap-0.5" aria-label={`${n} звёзд`}>
      {arr.map((f,i)=>(<span key={i} className={f? 'text-premium-gold':'text-white/30'}>★</span>))}
    </div>
  );
}

export default function StayCard({ item }: { item: StayItem & { stars?: number; images?: string[] } }) {
  const images = useMemo(()=> item.images && item.images.length ? item.images : [item.img], [item]);
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-premium-gold/50 transition">
      <div className="grid grid-cols-1 sm:grid-cols-[240px_1fr]">
        <div className="relative w-full h-48 sm:h-44 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[idx]} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
          {images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between p-2">
              <button onClick={prev} className="h-8 w-8 rounded-full bg-black/50 text-white grid place-items-center">‹</button>
              <button onClick={next} className="h-8 w-8 rounded-full bg-black/50 text-white grid place-items-center">›</button>
            </div>
          )}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_,i)=>(<span key={i} className={`h-1.5 w-1.5 rounded-full ${i===idx?'bg-premium-gold':'bg-white/50'}`} />))}
            </div>
          )}
        </div>
        <div className="p-4 grid gap-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-lg">{item.title}</h3>
              <div className="text-white/70 text-sm">{item.location}</div>
              {typeof (item as any).stars === 'number' && <Stars n={(item as any).stars as number} />}
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

