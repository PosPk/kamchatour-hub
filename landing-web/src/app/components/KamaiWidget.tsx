"use client";

import { useEffect, useRef, useState } from 'react';

export default function KamaiWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('Привет! Подскажи популярные туры и безопасность.');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: 'Я AI.Kam — ИИ‑администратор. Чем помочь?' },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => { listRef.current?.scrollTo({ top: 999999, behavior: 'smooth' }); }, [messages, open]);

  const send = async () => {
    if (!input.trim()) return;
    const next = [...messages, { role: 'user' as const, content: input }];
    setMessages(next);
    setInput('');
    try {
      const resp = await fetch('/api/ai/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next }) });
      const data = await resp.json();
      setMessages([...next, { role: 'assistant', content: data?.content || 'Ок.' }]);
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Ошибка сети, попробуйте позже.' }]);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(!open)} className="fixed z-50 bottom-5 right-5 h-12 px-4 rounded-full bg-premium-gold text-premium-black font-bold shadow-lg">
        {open ? 'Закрыть AI.Kam' : 'AI.Kam • помощь'}
      </button>
      {open && (
        <div className="fixed z-50 bottom-20 right-5 w-[min(92vw,360px)] rounded-2xl bg-black/80 backdrop-blur border border-white/10 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 font-bold">AI.Kam — ИИ‑администратор</div>
          <div ref={listRef} className="h-64 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'assistant' ? 'text-white/90' : 'text-premium-gold'}>
                {m.content}
              </div>
            ))}
          </div>
          <div className="p-3 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Спросите у AI.Kam…" className="flex-1 h-10 rounded-xl px-3 text-slate-900" />
            <button onClick={send} className="h-10 px-4 rounded-xl bg-premium-gold text-premium-black font-bold">Отправить</button>
          </div>
        </div>
      )}
    </>
  );
}

