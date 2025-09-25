"use client";

import { useEffect, useRef, useState } from 'react';
import DateRangePicker, { type DateRange } from './DateRangePicker';
import GuestsSelector, { type Guests } from './GuestsSelector';

type Suggest = { id: string; label: string; type: 'city' | 'region' | 'poi' };

export default function StaySearchBar({ onSearch }: { onSearch: (q: { location: string; range: DateRange; guests: Guests; work: boolean }) => void }) {
  const [location, setLocation] = useState('');
  const [suggests, setSuggests] = useState<Suggest[]>([]);
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [dateOpen, setDateOpen] = useState(false);
  const [guests, setGuests] = useState<Guests>({ adults: 2, children: 0, rooms: 1 });
  const [forWork, setForWork] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    async function go() {
      if (!location || location.length < 2) { setSuggests([]); return; }
      try {
        const sys = { role: 'system', content: 'Выдавай до 6 кратких подсказок гео по Камчатке: города, районы, ориентиры. Формат: label | type(city|region|poi). Только по Камчатскому краю.' };
        const user = { role: 'user', content: `подсказки: ${location}` };
        const resp = await fetch('/api/ai/groq', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [sys, user], max_tokens: 200, temperature: 0.2 }) , signal: ctrl.signal });
        const data = await resp.json();
        const text = data?.choices?.[0]?.message?.content || '';
        const lines = String(text).split('\n').map((s: string)=>s.trim()).filter(Boolean).slice(0,6);
        const parsed: Suggest[] = lines.map((l: string, i: number) => {
          const [label, type] = l.split('|').map((s)=>s.trim());
          return { id: `s${i}`, label: label || l, type: (type as any) || 'poi' };
        });
        setSuggests(parsed);
      } catch { /* ignore */ }
    }
    const t = setTimeout(go, 200);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [location]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-2 grid sm:grid-cols-[2fr_1.5fr_1.5fr_1fr_auto] gap-2 items-center">
      <div className="relative">
        <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Куда вы едете?" className="h-11 rounded-xl px-3 text-slate-900 w-full" />
        {!!suggests.length && (
          <div className="absolute z-40 mt-1 rounded-xl border border-white/10 bg-premium-black w-full p-1">
            {suggests.map(s => (
              <button key={s.id} onClick={()=>{ setLocation(s.label); setSuggests([]); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-sm">
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="relative">
        <button ref={anchorRef} onClick={()=>setDateOpen(v=>!v)} className="h-11 rounded-xl px-3 text-slate-900 w-full text-left">
          {range.start ? range.start.toLocaleDateString('ru-RU') : 'Дата заезда'} — {range.end ? range.end.toLocaleDateString('ru-RU') : 'Дата выезда'}
        </button>
        {dateOpen && (
          <div className="absolute top-[3.2rem] left-0">
            <DateRangePicker value={range} onChange={setRange} onClose={()=>setDateOpen(false)} anchorRef={anchorRef} />
          </div>
        )}
      </div>
      <GuestsSelector value={guests} onChange={setGuests} />
      <label className="flex items-center gap-2 text-sm text-white/80 px-2">
        <input type="checkbox" checked={forWork} onChange={e=>setForWork(e.target.checked)} /> Для работы
      </label>
      <button onClick={()=>onSearch({ location, range, guests, work: forWork })} className="h-11 rounded-xl px-4 bg-premium-gold text-premium-black font-bold">Найти</button>
    </div>
  );
}

