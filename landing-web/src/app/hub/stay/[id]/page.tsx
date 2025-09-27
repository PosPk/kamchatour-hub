"use client";

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { HOTELS } from '../hotels';

export default function StayDetail() {
  const params = useParams();
  const id = String(params?.id || '');
  const hotel = useMemo(()=>HOTELS.find(h=>h.id===id), [id]);
  const [idx, setIdx] = useState(0);
  if (!hotel) return (
    <main className="min-h-screen bg-premium-black text-white px-6 py-8 grid gap-6">
      <Link href="/hub/stay" className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm">← К списку</Link>
      <div>Объект не найден.</div>
    </main>
  );
  const next = () => setIdx(i => (i+1)%hotel.images.length);
  const prev = () => setIdx(i => (i-1+hotel.images.length)%hotel.images.length);
  return (
    <main className="min-h-screen bg-premium-black text-white px-6 py-8 grid gap-6">
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/hub/stay" className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm">← К списку</Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold">{hotel.name}</h1>
        </div>
        <div className="rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-center">
          <div className="text-xl font-black text-premium-gold">{hotel.rating.toFixed(1)}</div>
          <div className="text-xs text-white/70">{hotel.reviews} отзывов</div>
        </div>
      </header>

      <section className="rounded-2xl border border-white/10 overflow-hidden">
        <div className="relative w-full h-[40vh] bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hotel.images[idx]} alt={hotel.name} className="w-full h-full object-cover" />
          {hotel.images.length>1 && (
            <div className="absolute inset-0 flex items-center justify-between p-3">
              <button onClick={prev} className="h-9 w-9 rounded-full bg-black/50 text-white grid place-items-center">‹</button>
              <button onClick={next} className="h-9 w-9 rounded-full bg-black/50 text-white grid place-items-center">›</button>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-white/80">{hotel.location} • {hotel.distanceKm} км до центра</div>
            <p className="mt-2">{hotel.description}</p>
            <div className="mt-3 text-sm text-white/80">Удобства: {hotel.amenities.join(', ')}</div>
          </div>
        </div>
        <aside className="grid gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-white/70">Цена за ночь</div>
            <div className="text-3xl font-black text-premium-gold">{hotel.price.toLocaleString('ru-RU')} ₽</div>
            <button className="mt-3 h-11 rounded-xl bg-premium-gold text-premium-black font-bold w-full">Забронировать</button>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-0 overflow-hidden">
            <div className="h-[240px]" id="map-holder">
              {/* Simple static map image as placeholder - upgrade to Leaflet if needed */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Карта" src={`https://static-maps.yandex.ru/1.x/?ll=${hotel.coords.lng},${hotel.coords.lat}&size=450,240&z=11&l=map&pt=${hotel.coords.lng},${hotel.coords.lat},pm2dgl`} className="w-full h-full object-cover" />
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

