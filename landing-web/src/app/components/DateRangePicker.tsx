"use client";

import { useEffect, useMemo, useRef, useState } from 'react';

export type DateRange = { start: Date | null; end: Date | null };

function startOfDay(d: Date) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function addMonths(d: Date, m: number) { const x = new Date(d); x.setMonth(x.getMonth() + m); return x; }
function daysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate(); }
function isSameDate(a: Date, b: Date) { return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }
function isBefore(a: Date, b: Date) { return startOfDay(a).getTime() < startOfDay(b).getTime(); }
function isAfter(a: Date, b: Date) { return startOfDay(a).getTime() > startOfDay(b).getTime(); }

function MonthGrid({ monthDate, range, onPick, minDate }: { monthDate: Date; range: DateRange; onPick: (d: Date) => void; minDate: Date; }) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const first = new Date(year, month, 1);
  const firstWeekday = (first.getDay() + 6) % 7; // Mon=0
  const total = daysInMonth(year, month);
  const days: (Date | null)[] = [];
  for (let i=0;i<firstWeekday;i++) days.push(null);
  for (let d=1; d<=total; d++) days.push(new Date(year, month, d));
  while (days.length % 7 !== 0) days.push(null);

  const inRange = (d: Date) => range.start && range.end && (isAfter(d, range.start) || isSameDate(d, range.start)) && (isBefore(d, range.end) || isSameDate(d, range.end));
  const disabled = (d: Date) => isBefore(d, minDate);

  const weekDays = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

  return (
    <div className="p-3">
      <div className="text-center font-semibold mb-2">{monthDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}</div>
      <div className="grid grid-cols-7 gap-1 text-xs text-white/60 mb-1">
        {weekDays.map(w => <div key={w} className="h-7 grid place-items-center">{w}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          if (!d) return <div key={i} className="h-9" />;
          const selStart = range.start && isSameDate(d, range.start);
          const selEnd = range.end && isSameDate(d, range.end);
          const inR = range.start && range.end && inRange(d);
          const dis = disabled(d);
          return (
            <button
              key={i}
              disabled={dis}
              onClick={() => onPick(d)}
              className={`h-9 rounded-md text-sm grid place-items-center
                ${dis ? 'text-white/25 cursor-not-allowed' : 'hover:bg-white/10'}
                ${inR ? 'bg-premium-gold/20' : ''}
                ${selStart || selEnd ? 'bg-premium-gold text-premium-black font-bold' : ''}`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DateRangePicker({ value, onChange, onClose, anchorRef }: { value: DateRange; onChange: (r: DateRange) => void; onClose?: () => void; anchorRef?: React.RefObject<HTMLElement>; }) {
  const today = startOfDay(new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [view, setView] = useState<Date>(() => startOfDay(value.start || today));
  const ref = useRef<HTMLDivElement>(null);

  const range = useMemo(() => value, [value]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (ref.current && !ref.current.contains(t) && !(anchorRef?.current && anchorRef.current.contains(t as Node))) {
        onClose?.();
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [onClose, anchorRef]);

  const pick = (d: Date) => {
    if (!range.start || (range.start && range.end)) {
      onChange({ start: d, end: null });
      setHoverDate(null);
      return;
    }
    if (range.start && !range.end) {
      if (isBefore(d, range.start)) {
        onChange({ start: d, end: range.start });
      } else {
        onChange({ start: range.start, end: d });
      }
      setHoverDate(null);
    }
  };

  return (
    <div ref={ref} className="absolute z-50 mt-2 rounded-2xl border border-white/10 bg-premium-black shadow-xl overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <div className="text-sm text-white/70">Выберите даты</div>
        <div className="flex gap-2">
          <button onClick={() => setView(addMonths(view, -1))} className="h-8 w-8 grid place-items-center rounded-lg bg-white/10 hover:bg-white/15">‹</button>
          <button onClick={() => setView(addMonths(view, 1))} className="h-8 w-8 grid place-items-center rounded-lg bg-white/10 hover:bg-white/15">›</button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <MonthGrid monthDate={view} range={range} onPick={pick} minDate={today} />
        <MonthGrid monthDate={addMonths(view, 1)} range={range} onPick={pick} minDate={today} />
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-white/10">
        <button onClick={() => onChange({ start: null, end: null })} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm">Очистить</button>
        <div className="text-sm text-white/70">
          {range.start ? range.start.toLocaleDateString('ru-RU') : '—'} → {range.end ? range.end.toLocaleDateString('ru-RU') : '—'}
        </div>
        <button onClick={onClose} className="px-3 py-2 rounded-lg bg-premium-gold text-premium-black font-semibold text-sm">Готово</button>
      </div>
    </div>
  );
}

