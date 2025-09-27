"use client";

import { useState } from 'react';

export type Filters = {
  priceMin: number;
  priceMax: number;
  types: string[];
  minRating: number | null; // гостевой рейтинг (4.5+)
  minStars: number | null; // звездность (>=)
  amenities: string[];
  region: string | null; // город/район
  maxDistanceKm: number;
};

const TYPES = ['Отель','Гостевой дом','Апартаменты','Турбаза','Хостел','Частный дом','Вилла'];
const AMENITIES = ['Бесплатный Wi‑Fi','Парковка','Завтрак','Термальный бассейн','Спа‑услуги','Трансфер'];
const REGIONS = ['Петропавловск‑Камчатский','Елизово','Паратунка','Мильково','р. Камчатка'];

export default function FilterSidebar({ value, onChange, onApply, onReset }: { value: Filters; onChange: (f: Filters) => void; onApply: () => void; onReset?: () => void }) {
  const v = value;
  const set = (p: Partial<Filters>) => onChange({ ...v, ...p });
  const toggle = (key: 'types'|'amenities', item: string) => {
    const arr = new Set(v[key]);
    if (arr.has(item)) arr.delete(item); else arr.add(item);
    set({ [key]: Array.from(arr) } as any);
  };

  return (
    <aside className="rounded-2xl border border-white/10 bg-white/5 p-4 grid gap-4">
      <div className="text-lg font-extrabold">Фильтровать результаты</div>

      <div className="grid gap-2">
        <div className="text-sm text-white/70">Цена за ночь (руб.)</div>
        <div className="flex items-center gap-2">
          <input type="number" className="h-10 rounded-lg px-3 text-slate-900 w-28" value={v.priceMin} onChange={e=>set({ priceMin: Number(e.target.value)||0 })} />
          <span className="text-white/60">—</span>
          <input type="number" className="h-10 rounded-lg px-3 text-slate-900 w-28" value={v.priceMax} onChange={e=>set({ priceMax: Number(e.target.value)||0 })} />
        </div>
        <div className="px-1">
          <input type="range" min={0} max={30000} step={500} value={v.priceMin} onChange={e=>set({ priceMin: Number(e.target.value) })} className="w-full" />
          <input type="range" min={0} max={30000} step={500} value={v.priceMax} onChange={e=>set({ priceMax: Number(e.target.value) })} className="w-full -mt-2" />
        </div>
      </div>

      <div className="grid gap-2">
        <div className="text-sm text-white/70">Рейтинг гостей</div>
        {[4.5,4.0,3.5,3.0].map(r => (
          <label key={r} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={v.minRating === r} onChange={()=>set({ minRating: v.minRating === r ? null : r })} /> {r.toFixed(1)}+
          </label>
        ))}
      </div>

      <div className="grid gap-2">
        <div className="text-sm text-white/70">Категория (звёзды)</div>
        {[5,4,3,2].map(s => (
          <label key={s} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={v.minStars === s} onChange={()=>set({ minStars: v.minStars === s ? null : s })} /> {s}★ и выше
          </label>
        ))}
      </div>

      <div className="grid gap-2">
        <div className="text-sm text-white/70">Тип жилья</div>
        {TYPES.map(t => (
          <label key={t} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={v.types.includes(t)} onChange={()=>toggle('types', t)} /> {t}
          </label>
        ))}
      </div>

      <div className="grid gap-2">
        <div className="text-sm text-white/70">Удобства</div>
        {[...AMENITIES, 'Размещение с животными'].map(a => (
          <label key={a} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={v.amenities.includes(a)} onChange={()=>toggle('amenities', a)} /> {a}
          </label>
        ))}
      </div>

      <div className="grid gap-2">
        <div className="text-sm text-white/70">Район Камчатки</div>
        <select value={v.region || ''} onChange={e=>set({ region: e.target.value || null })} className="h-10 rounded-lg px-3 bg-white/10 border border-white/10">
          <option value="">Любой</option>
          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="grid gap-2">
        <div className="text-sm text-white/70">Расстояние до центра (км)</div>
        <div className="flex items-center gap-2">
          <input type="range" min={1} max={50} step={1} value={v.maxDistanceKm} onChange={e=>set({ maxDistanceKm: Number(e.target.value) })} className="w-full" />
          <div className="w-12 text-right text-sm">{v.maxDistanceKm}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={()=>onReset?.()} className="h-11 rounded-xl bg-white/10">Сбросить всё</button>
        <button onClick={onApply} className="h-11 rounded-xl bg-premium-gold text-premium-black font-bold">Применить</button>
      </div>
    </aside>
  );
}

