"use client";

import { useEffect, useRef, useState } from 'react';

export type Guests = { adults: number; children: number; childAges: number[]; rooms: number };

export default function GuestsSelector({ value, onChange, className }: { value: Guests; onChange: (g: Guests) => void; className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const Badge = () => {
    const childrenLabel = value.children > 0
      ? `${value.children} реб.` + (value.childAges.length ? ' (' + value.childAges.join(',') + ')' : '')
      : '0 реб.';
    return (
      <button onClick={() => setOpen(v=>!v)} className={`h-11 rounded-xl px-3 text-slate-900 w-full text-left ${className || ''}`}>
        {value.adults} взр., {childrenLabel}, {value.rooms} ном.
      </button>
    );
  };

  return (
    <div className="relative" ref={ref}>
      <Badge />
      {open && (
        <div
          className="fixed z-[9999] rounded-2xl border border-white/10 bg-premium-black shadow-xl p-3 grid gap-3"
          style={{
            top: (() => { const r = ref.current?.getBoundingClientRect(); return r ? r.bottom + window.scrollY + 6 : 0; })(),
            left: (() => { const r = ref.current?.getBoundingClientRect(); return r ? r.left + window.scrollX : 0; })(),
            minWidth: Math.max(260, (ref.current?.getBoundingClientRect()?.width || 260)),
            position: 'fixed' as const,
          }}
        >
          {(() => {
            const rows: Array<{ k: 'adults' | 'children' | 'rooms'; label: string }> = [
              { k: 'adults', label: 'Взрослые' },
              { k: 'children', label: 'Дети' },
              { k: 'rooms', label: 'Номера' },
            ];
            return rows.map(({ k, label }) => (
            <div key={k} className="flex items-center justify-between">
              <div>{label}</div>
              <div className="flex items-center gap-2">
                <button onClick={() => {
                  const next = Math.max(0, (value as any)[k]-1);
                  if (k==='children') {
                    const ages = value.childAges.slice(0, next);
                    onChange({ ...value, children: next, childAges: ages });
                  } else {
                    onChange({ ...value, [k]: next } as any);
                  }
                }} className="h-8 w-8 grid place-items-center rounded-lg bg-white/10 hover:bg-white/15">-</button>
                <div className="w-8 text-center">{(value as any)[k]}</div>
                <button onClick={() => {
                  const next = (value as any)[k]+1;
                  if (k==='children') {
                    const ages = [...value.childAges];
                    if (ages.length < next) ages.push(7);
                    onChange({ ...value, children: next, childAges: ages });
                  } else {
                    onChange({ ...value, [k]: next } as any);
                  }
                }} className="h-8 w-8 grid place-items-center rounded-lg bg-white/10 hover:bg-white/15">+</button>
              </div>
            </div>
            ));
          })()}

          {value.children > 0 && (
            <div className="grid gap-2">
              <div className="text-xs text-white/70">Возраст детей</div>
              {value.childAges.map((age, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div>Ребёнок {idx+1}</div>
                  <select value={age} onChange={e=>{
                    const ages = [...value.childAges];
                    ages[idx] = Number(e.target.value);
                    onChange({ ...value, childAges: ages });
                  }} className="h-9 rounded-lg px-2 bg-white/10 border border-white/10">
                    {Array.from({length:18}).map((_,i)=>(<option key={i} value={i}>{i}</option>))}
                  </select>
                </div>
              ))}
            </div>
          )}
          <button onClick={()=>setOpen(false)} className="px-3 py-2 rounded-lg bg-premium-gold text-premium-black font-semibold text-sm">Готово</button>
        </div>
      )}
    </div>
  );
}

