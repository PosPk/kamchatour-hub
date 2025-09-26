"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import DateRangePicker, { type DateRange } from '../../components/DateRangePicker';
import GuestsSelector, { type Guests } from '../../components/GuestsSelector';
import StaySearchBar from '../../components/StaySearchBar';
import FilterSidebar, { type Filters } from '../../components/FilterSidebar';
import StayCard from '../../components/StayCard';

type PropertyCard = {
  id: string;
  title: string;
  location: string;
  rating: number;
  priceFrom: number;
  img: string;
  tags: string[];
};

const MOCK: PropertyCard[] = [
  { id: 'kutkha', title: 'База «Кутха»', location: 'Елизовский район', rating: 4.8, priceFrom: 4200, img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop', tags: ['баня','река','семейный'] },
  { id: 'river-lodge', title: 'River Lodge', location: 'р. Камчатка', rating: 4.9, priceFrom: 5800, img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop', tags: ['рыбалка','трансфер','полный пансион'] },
  { id: 'volcano-view', title: 'Volcano View', location: 'Петропавловск‑Камчатский', rating: 4.7, priceFrom: 3500, img: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1200&auto=format&fit=crop', tags: ['вид на вулканы','центр'] },
];

export default function StayHub() {
  const [role, setRole] = useState<'tourist' | 'operator'>('tourist');
  const [q, setQ] = useState('');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const filtered = useMemo(() => {
    return MOCK.filter(p => {
      const okQ = !q || (p.title + ' ' + p.location + ' ' + p.tags.join(' ')).toLowerCase().includes(q.toLowerCase());
      const okMin = minPrice === '' || p.priceFrom >= Number(minPrice);
      const okMax = maxPrice === '' || p.priceFrom <= Number(maxPrice);
      return okQ && okMin && okMax;
    });
  }, [q, minPrice, maxPrice]);

  const [dateOpen, setDateOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [guests, setGuests] = useState<Guests>({ adults: 2, children: 0, childAges: [], rooms: 1 });
  const [filters, setFilters] = useState<Filters>({ priceMin: 0, priceMax: 30000, types: [], minRating: null, amenities: [] });

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
          <button onClick={()=>setDateOpen(v=>!v)} className="h-11 rounded-xl px-3 text-slate-900 text-left relative" id="date-anchor">
            {dateRange.start ? dateRange.start.toLocaleDateString('ru-RU') : 'Дата заезда'} — {dateRange.end ? dateRange.end.toLocaleDateString('ru-RU') : 'Дата выезда'}
          </button>
          <GuestsSelector value={guests} onChange={setGuests} />
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
            <select className="h-10 rounded-xl px-3 bg-white/10 border border-white/10">
              <option>Сортировка: по популярности</option>
              <option>Сортировка: цена ↑</option>
              <option>Сортировка: цена ↓</option>
              <option>Сортировка: рейтинг</option>
            </select>
          </div>
        </div>
      </section>

      {/* Two-column layout: filters + results */}
      <section className="grid gap-4 sm:grid-cols-[280px_1fr]">
        <FilterSidebar value={filters} onChange={setFilters} onApply={()=>{ /* hook to apply */ }} />
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
          <div className="grid gap-3">
            {filtered.map(p => (
              <StayCard key={p.id} item={{ id: p.id, title: p.title, location: p.location, rating: p.rating, priceFrom: p.priceFrom, img: p.img, reviews: 128, summary: 'Рядом с термальными источниками, удобная парковка, Wi‑Fi' }} />
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}

