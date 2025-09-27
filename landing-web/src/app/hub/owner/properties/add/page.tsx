"use client";

import { useState } from 'react';

type Step = 1|2|3;

export default function AddPropertyWizard() {
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<any>({ title: '', type: 'Отель', description: '', address: '', amenities: [], photos: [] });
  const next = () => setStep(s => ((s === 1) ? 2 : 3));
  const prev = () => setStep(s => ((s === 3) ? 2 : 1));
  return (
    <div className="grid gap-4">
      <div className="text-xl font-extrabold">Добавление объекта</div>
      <div className="flex items-center gap-2 text-sm">
        <div className={`h-2 flex-1 rounded ${step>=1?'bg-premium-gold':'bg-white/10'}`} />
        <div className={`h-2 flex-1 rounded ${step>=2?'bg-premium-gold':'bg-white/10'}`} />
        <div className={`h-2 flex-1 rounded ${step>=3?'bg-premium-gold':'bg-white/10'}`} />
      </div>

      {step===1 && (
        <section className="grid gap-3">
          <div className="text-lg font-semibold">Шаг 1: Основная информация</div>
          <input value={data.title} onChange={e=>setData({...data, title:e.target.value})} placeholder="Название объекта" className="h-11 rounded-xl px-3 text-slate-900" />
          <select value={data.type} onChange={e=>setData({...data, type:e.target.value})} className="h-11 rounded-xl px-3 bg-white/10 border border-white/10">
            {['Отель','Апартаменты','Гостевой дом','Вилла','Хостел','Частный дом','Турбаза'].map(t=> <option key={t} value={t}>{t}</option>)}
          </select>
          <textarea value={data.description} onChange={e=>setData({...data, description:e.target.value})} placeholder="Описание (мин. 200 символов)" className="min-h-[120px] rounded-xl px-3 py-2 text-slate-900" />
          <input value={data.address} onChange={e=>setData({...data, address:e.target.value})} placeholder="Адрес" className="h-11 rounded-xl px-3 text-slate-900" />
        </section>
      )}

      {step===2 && (
        <section className="grid gap-3">
          <div className="text-lg font-semibold">Шаг 2: Удобства</div>
          <div className="grid sm:grid-cols-2 gap-2">
            {['Бесплатный Wi‑Fi','Парковка','Завтрак','Термальный бассейн','Спа‑услуги','Трансфер','Размещение с животными'].map(a => (
              <label key={a} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={data.amenities.includes(a)} onChange={e=>{
                  const set = new Set(data.amenities);
                  if (set.has(a)) set.delete(a); else set.add(a);
                  setData({...data, amenities: Array.from(set)});
                }} /> {a}
              </label>
            ))}
          </div>
        </section>
      )}

      {step===3 && (
        <section className="grid gap-3">
          <div className="text-lg font-semibold">Шаг 3: Фотографии</div>
          <input type="file" accept="image/*" multiple onChange={e=>{
            const files = Array.from(e.target.files||[]).slice(0,10);
            const readers = files.map(f => new Promise<string>((res)=>{ const r=new FileReader(); r.onload=()=>res(r.result as string); r.readAsDataURL(f); }));
            Promise.all(readers).then(urls => setData({...data, photos: urls}));
          }} />
          {data.photos.length>0 && (
            <div className="grid grid-cols-3 gap-2">
              {data.photos.map((src:string,i:number)=>(
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt="preview" className="w-full h-24 object-cover rounded" />
              ))}
            </div>
          )}
          <div className="text-xs text-white/60">Ограничение: до 10 фото, каждое до 5 MB</div>
        </section>
      )}

      <div className="flex items-center justify-between">
        <button onClick={prev} disabled={step===1} className="h-11 px-4 rounded-xl bg-white/10 disabled:opacity-50">Назад</button>
        {step<3 ? (
          <button onClick={next} className="h-11 px-4 rounded-xl bg-premium-gold text-premium-black font-bold">Далее</button>
        ) : (
          <button onClick={()=>{ window.location.href = '/hub/owner/dashboard'; }} className="h-11 px-4 rounded-xl bg-premium-gold text-premium-black font-bold">Сохранить</button>
        )}
      </div>
    </div>
  );
}

