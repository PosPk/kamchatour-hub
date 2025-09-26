"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import DateRangePicker, { type DateRange } from '../../components/DateRangePicker';
import GuestsSelector, { type Guests } from '../../components/GuestsSelector';
import StaySearchBar from '../../components/StaySearchBar';
import FilterSidebar, { type Filters } from '../../components/FilterSidebar';
import StayCard from '../../components/StayCard';
import { HOTELS } from './hotels';

type PropertyCard = {
  id: string;
  title: string;
  location: string;
  rating: number;
  priceFrom: number;
  img: string;
  tags: string[];
};

const MOCK: PropertyCard[] = HOTELS.map(h => ({ id: h.id, title: h.name, location: h.location, rating: h.rating, priceFrom: h.price, img: h.images[0], tags: h.amenities.slice(0,3) }));

export default function StayHub() {
  const [role, setRole] = useState<'tourist' | 'operator'>('tourist');
  const [q, setQ] = useState('');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [sort, setSort] = useState<'pop'|'price_asc'|'price_desc'|'rating'>('pop');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({ priceMin: 0, priceMax: 30000, types: [], minRating: null, minStars: null, amenities: [], region: null, maxDistanceKm: 50 });

  const filtered = useMemo(() => {
    const list = HOTELS.filter(h => {
      // search text over name/location/amenities
      const okQ = !q || (`${h.name} ${h.location} ${h.amenities.join(' ')}`.toLowerCase().includes(q.toLowerCase()));
      if (!okQ) return false;
      // price
      if (minPrice !== '' && h.price < Number(minPrice)) return false;
      if (maxPrice !== '' && h.price > Number(maxPrice)) return false;
      if (filters.priceMin && h.price < filters.priceMin) return false;
      if (filters.priceMax && h.price > filters.priceMax) return false;
      // region
      if (filters.region && h.location !== filters.region) return false;
      // types
      if (filters.types && filters.types.length > 0 && !filters.types.includes(h.type)) return false;
      // stars
      if (filters.minStars && (h.stars || 0) < filters.minStars) return false;
      // guest rating
      if (filters.minRating && h.rating < filters.minRating) return false;
      // amenities (all selected must be present)
      if (filters.amenities && filters.amenities.length > 0) {
        const hasAll = filters.amenities.every(a => h.amenities.includes(a));
        if (!hasAll) return false;
      }
      return true;
    }).map(h => ({
      id: h.id,
      title: h.name,
      location: h.location,
      rating: h.rating,
      priceFrom: h.price,
      img: h.images[0],
      tags: h.amenities.slice(0,3),
    }));

    const sorted = list.sort((a,b)=>{
      if (sort==='price_asc') return a.priceFrom - b.priceFrom;
      if (sort==='price_desc') return b.priceFrom - a.priceFrom;
      if (sort==='rating') return b.rating - a.rating;
      return 0;
    });
    return sorted;
  }, [q, minPrice, maxPrice, filters, sort]);

  const [dateOpen, setDateOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [guests, setGuests] = useState<Guests>({ adults: 2, children: 0, childAges: [], rooms: 1 });

  return (
    <main className="min-h-screen bg-premium-black text-white px-6 py-8 grid gap-6">
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <a href="/" className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm">← На главную</a>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Размещение</h1>
        </div>
        <div className="flex gap-2 bg-white/5 border border-white/10 rounded-full p-1">
          {(['tourist','operator'] as const).map(r => (
            <button key={r} onClick={() => setRole(r)} className={`px-3 py-1.5 rounded-full text-sm ${role===r?'bg-premium-gold text-premium-black':'hover:bg-white/10'}`}>{r==='tourist'?'Турист':'Туроператор'}</button>
          ))}
        </div>
      </header>

      {/* Hero with search */}
      <section className="relative overflow-hidden rounded-3xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1920&auto=format&fit=crop" alt="Hero" className="w-full h-[32vh] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 p-6 grid content-end gap-3">
          <div className="text-2xl font-extrabold">Найдите идеальное место для отдыха на Камчатке</div>
          <div className="text-white/85">От уютных гостевых домов до современных отелей — с лучшей ценой.</div>
          <StaySearchBar onSearch={()=>{ /* TODO: hook to SSR search */ }} />
        </div>
      </section>

      {/* Filters */}
      <section className="grid gap-3 relative">
        <div className="grid sm:grid-cols-5 gap-3">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Куда: база, район…" className="h-11 rounded-xl px-3 text-slate-900 sm:col-span-2" />
          <button onClick={()=>setDateOpen(v=>!v)} className="h-11 rounded-xl px-3 text-slate-900 text-left relative ring-1 ring-premium-gold/60 focus:ring-2 focus:ring-premium-gold" id="date-anchor">
            {dateRange.start ? dateRange.start.toLocaleDateString('ru-RU') : 'Дата заезда'} — {dateRange.end ? dateRange.end.toLocaleDateString('ru-RU') : 'Дата выезда'}
          </button>
          <GuestsSelector value={guests} onChange={setGuests} className="ring-1 ring-premium-gold/60 focus:ring-2 focus:ring-premium-gold" />
        </div>
        {dateOpen && (
          <DateRangePicker value={dateRange} onChange={setDateRange} onClose={()=>setDateOpen(false)} anchorRef={{ current: (document?.getElementById?.('date-anchor') as any) || null }} />
        )}
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="grid grid-cols-2 gap-3">
            <input type="number" value={minPrice} onChange={e=>setMinPrice(e.target.value===''?'':Number(e.target.value))} placeholder="Мин ₽/ночь" className="h-11 rounded-xl px-3 text-slate-900" />
            <input type="number" value={maxPrice} onChange={e=>setMaxPrice(e.target.value===''?'':Number(e.target.value))} placeholder="Макс ₽/ночь" className="h-11 rounded-xl px-3 text-slate-900" />
          </div>
          <div className="flex items-center gap-2 text-sm overflow-x-auto no-scrollbar sm:col-span-2">
            {['баня','река','рыбалка','пансион','вид на вулканы','семейный','центр','трансфер'].map(t => (
              <button key={t} onClick={()=>setQ((prev)=>prev?prev+" "+t:t)} className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/15 whitespace-nowrap">{t}</button>
            ))}
            <select value={sort} onChange={e=>setSort(e.target.value as any)} className="h-10 rounded-xl px-3 bg-white/10 border border-white/10">
              <option value="pop">Сортировка: по популярности</option>
              <option value="price_asc">Сортировка: цена ↑</option>
              <option value="price_desc">Сортировка: цена ↓</option>
              <option value="rating">Сортировка: рейтинг</option>
            </select>
          </div>
        </div>
      </section>

      {/* Two-column layout: filters + results */}
      <section className="grid gap-4 sm:grid-cols-[280px_1fr]">
        <div className="hidden sm:block">
          <FilterSidebar value={filters} onChange={setFilters} onApply={()=>{ /* hook to apply */ }} />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center justify-between text-sm">
            <div className="text-white/70">Найдено вариантов: {filtered.length}</div>
            <select className="h-10 rounded-xl px-3 bg-white/10 border border-white/10">
              <option>Рекомендуемые</option>
              <option>Цена: низкая → высокая</option>
              <option>Цена: высокая → низкая</option>
              <option>Рейтинг</option>
            </select>
          </div>
          {/* Mobile filters trigger */}
          <div className="sm:hidden">
            <button onClick={()=>setMobileFiltersOpen(true)} className="w-full h-11 rounded-xl bg-premium-gold text-premium-black font-bold">Фильтры</button>
          </div>
          <div className="grid gap-3">
            {filtered.map(p => {
              const full = HOTELS.find(h=>h.id===p.id);
              return (
                <StayCard key={p.id} item={{ id: p.id, title: p.title, location: p.location, rating: p.rating, priceFrom: p.priceFrom, img: p.img, reviews: full?.reviews || 0, summary: full?.description.slice(0,120)+'…', stars: full?.stars, images: full?.images, type: full?.type, amenities: full?.amenities }} />
              );
            })}
          </div>
        </div>
      </section>

      {/* Mobile off-canvas filters */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={()=>setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[88%] max-w-[360px] bg-premium-black border-l border-white/10 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-extrabold">Фильтры</div>
              <button onClick={()=>setMobileFiltersOpen(false)} className="h-8 w-8 rounded-lg bg-white/10">✕</button>
            </div>
            <FilterSidebar value={filters} onChange={setFilters} onApply={()=>setMobileFiltersOpen(false)} />
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button onClick={()=>{ setFilters({ priceMin: 0, priceMax: 30000, types: [], minRating: null, minStars: null, amenities: [], region: null, maxDistanceKm: 50 }); }} className="h-11 rounded-xl bg-white/10">Сбросить</button>
              <button onClick={()=>setMobileFiltersOpen(false)} className="h-11 rounded-xl bg-premium-gold text-premium-black font-bold">Показать</button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

