"use client";

import { useEffect, useRef, useState } from 'react';

export type Guests = { adults: number; children: number; rooms: number };

export default function GuestsSelector({ value, onChange }: { value: Guests; onChange: (g: Guests) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const Badge = () => (
    <button onClick={() => setOpen(v=>!v)} className="h-11 rounded-xl px-3 text-slate-900 w-full text-left">
      {value.adults} взрослых · {value.children} детей · {value.rooms} номеров
    </button>
  );

  return (
    <div className="relative" ref={ref}>
      <Badge />
      {open && (
        <div className="absolute z-50 mt-2 rounded-2xl border border-white/10 bg-premium-black shadow-xl w-64 p-3 grid gap-3">
          {([
            { k: 'adults', label: 'Взрослые' },
            { k: 'children', label: 'Дети' },
            { k: 'rooms', label: 'Номера' },
          ] as const).map(({k,label}) => (
            <div key={k} className="flex items-center justify-between">
              <div>{label}</div>
              <div className="flex items-center gap-2">
                <button onClick={()=>onChange({ ...value, [k]: Math.max(0, (value as any)[k]-1) })} className="h-8 w-8 grid place-items-center rounded-lg bg-white/10 hover:bg-white/15">-</button>
                <div className="w-8 text-center">{(value as any)[k]}</div>
                <button onClick={()=>onChange({ ...value, [k]: (value as any)[k]+1 })} className="h-8 w-8 grid place-items-center rounded-lg bg-white/10 hover:bg-white/15">+</button>
              </div>
            </div>
          ))}
          <button onClick={()=>setOpen(false)} className="px-3 py-2 rounded-lg bg-premium-gold text-premium-black font-semibold text-sm">Готово</button>
        </div>
      )}
    </div>
  );
}

