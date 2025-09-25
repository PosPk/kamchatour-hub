"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import DateRangePicker, { type DateRange } from '../../components/DateRangePicker';
import GuestsSelector, { type Guests } from '../../components/GuestsSelector';

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
  const [guests, setGuests] = useState<Guests>({ adults: 2, children: 0, rooms: 1 });

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

      {/* Search + filters (Booking-like simplified) */}
      <section className="grid gap-3 relative">
        <div className="grid sm:grid-cols-5 gap-3">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Куда: база, район…" className="h-11 rounded-xl px-3 text-slate-900 sm:col-span-2" />
          <button onClick={()=>setDateOpen(v=>!v)} className="h-11 rounded-xl px-3 text-slate-900 text-left">
            {dateRange.start ? dateRange.start.toLocaleDateString('ru-RU') : 'Дата заезда'} — {dateRange.end ? dateRange.end.toLocaleDateString('ru-RU') : 'Дата выезда'}
          </button>
          <GuestsSelector value={guests} onChange={setGuests} />
        </div>
        {dateOpen && (
          <div className="absolute z-50 top-[3.5rem] left-0">
            <DateRangePicker value={dateRange} onChange={setDateRange} onClose={()=>setDateOpen(false)} />
          </div>
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

      {/* Cards grid */}
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {filtered.map(p => (
          <article key={p.id} className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.img} alt={p.title} className="w-full h-40 object-cover" />
            <div className="p-4 grid gap-2">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold">{p.title}</h3>
                <div className="text-premium-gold font-bold">{p.rating.toFixed(1)}</div>
              </div>
              <div className="text-white/70 text-sm">{p.location}</div>
              <div className="text-sm flex flex-wrap gap-1">
                {p.tags.map(tag => <span key={tag} className="px-2 py-1 rounded-full bg-white/10 text-white/80 text-xs">{tag}</span>)}
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="text-white/85"><span className="font-black text-premium-gold">{p.priceFrom.toLocaleString('ru-RU')}</span> ₽/ночь</div>
                <Link href={`/hub/stay/${p.id}`} className="px-3 py-2 rounded-lg bg-premium-gold text-premium-black font-semibold">Подробнее</Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Calendar preview (stub) */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-4 grid gap-3">
        <div className="text-sm text-white/70">Предпросмотр календаря (стаб)</div>
        <div className="grid grid-cols-7 gap-[2px]">
          {Array.from({length: 28}).map((_,i)=> (
            <div key={i} className={`h-12 grid place-items-center text-xs ${i%5===0?'bg-green-900/40':'bg-white/5'}`}>{i+1}</div>
          ))}
        </div>
        {role==='operator' && (
          <div className="flex items-center justify-between pt-2">
            <Link href="/operator-web/stays/onboarding" className="px-4 py-2 rounded-lg bg-premium-gold text-premium-black font-semibold">Добавить объект</Link>
            <Link href="/operator-web" className="px-4 py-2 rounded-lg bg-white/10 font-semibold">Кабинет оператора</Link>
          </div>
        )}
      </section>
    </main>
  );
}

