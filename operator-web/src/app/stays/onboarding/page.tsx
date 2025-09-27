"use client";

import { useState } from 'react';

type Step = 'property' | 'amenities' | 'rooms' | 'pricing' | 'policies' | 'photos' | 'payments' | 'review';

export default function StayOnboarding() {
  const [step, setStep] = useState<Step>('property');
  const next = () => setStep(s => steps[steps.indexOf(s) + 1] || 'review');
  const prev = () => setStep(s => steps[steps.indexOf(s) - 1] || 'property');
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 grid gap-6">
      <h1 className="text-2xl font-bold">Размещение — онбординг (реф. Booking)</h1>
      <Stepper step={step} />
      {step === 'property' && <PropertyForm />}
      {step === 'amenities' && <AmenitiesForm />}
      {step === 'rooms' && <RoomsForm />}
      {step === 'pricing' && <PricingForm />}
      {step === 'policies' && <PoliciesForm />}
      {step === 'photos' && <PhotosForm />}
      {step === 'payments' && <PaymentsForm />}
      {step === 'review' && <ReviewBlock />}
      <div className="flex gap-3">
        <button onClick={prev} className="px-4 py-2 rounded border">Назад</button>
        <button onClick={next} className="px-4 py-2 rounded bg-blue-600 text-white">Далее</button>
      </div>
    </main>
  );
}

const steps: Step[] = ['property','amenities','rooms','pricing','policies','photos','payments','review'];

function Stepper({ step }: { step: Step }) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
      {steps.map(s => (
        <div key={s} className={`h-2 rounded ${s===step ? 'bg-blue-600' : 'bg-slate-300'}`} />
      ))}
    </div>
  );
}

function PropertyForm() {
  return (
    <section className="bg-white rounded border p-4 grid gap-3">
      <h2 className="font-bold">1. Основная информация</h2>
      <input placeholder="Название объекта" className="h-10 rounded border px-3" />
      <div className="grid sm:grid-cols-2 gap-3">
        <input placeholder="Адрес" className="h-10 rounded border px-3" />
        <input placeholder="Город/Нас.пункт" className="h-10 rounded border px-3" />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input placeholder="Широта" className="h-10 rounded border px-3" />
        <input placeholder="Долгота" className="h-10 rounded border px-3" />
      </div>
      <textarea placeholder="Описание" className="min-h-[100px] rounded border p-3" />
    </section>
  );
}

function AmenitiesForm() {
  const items = ['Wi‑Fi','Парковка','Кухня','Санузел в номере','Завтрак','Трансфер'];
  return (
    <section className="bg-white rounded border p-4 grid gap-3">
      <h2 className="font-bold">2. Удобства</h2>
      <div className="grid sm:grid-cols-3 gap-2">
        {items.map(i => (
          <label key={i} className="flex items-center gap-2"><input type="checkbox" /> {i}</label>
        ))}
      </div>
    </section>
  );
}

function RoomsForm() {
  return (
    <section className="bg-white rounded border p-4 grid gap-3">
      <h2 className="font-bold">3. Номера</h2>
      <div className="grid sm:grid-cols-3 gap-3">
        <input placeholder="Тип номера" className="h-10 rounded border px-3" />
        <input placeholder="Вместимость" className="h-10 rounded border px-3" />
        <input placeholder="Количество" className="h-10 rounded border px-3" />
      </div>
    </section>
  );
}

function PricingForm() {
  return (
    <section className="bg-white rounded border p-4 grid gap-3">
      <h2 className="font-bold">4. Цены</h2>
      <div className="grid sm:grid-cols-3 gap-3">
        <input placeholder="Базовая цена, ₽/ночь" className="h-10 rounded border px-3" />
        <input placeholder="Мин. кол-во ночей" className="h-10 rounded border px-3" />
        <input placeholder="Сезонные коэффициенты" className="h-10 rounded border px-3" />
      </div>
    </section>
  );
}

function PoliciesForm() {
  return (
    <section className="bg-white rounded border p-4 grid gap-3">
      <h2 className="font-bold">5. Правила</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        <input placeholder="Заезд (часы)" className="h-10 rounded border px-3" />
        <input placeholder="Выезд (часы)" className="h-10 rounded border px-3" />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <select className="h-10 rounded border px-3"><option>Отмена: гибкая</option><option>Строгая</option></select>
        <select className="h-10 rounded border px-3"><option>Оплата на месте</option><option>Онлайн</option></select>
      </div>
    </section>
  );
}

function PhotosForm() {
  return (
    <section className="bg-white rounded border p-4 grid gap-3">
      <h2 className="font-bold">6. Фото</h2>
      <div className="text-sm text-slate-600">Загрузите 5–10 фото (фасад, номера, общие зоны).</div>
      <input type="file" multiple />
    </section>
  );
}

function PaymentsForm() {
  return (
    <section className="bg-white rounded border p-4 grid gap-3">
      <h2 className="font-bold">7. Оплаты</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        <input placeholder="Получатель (ИП/ООО)" className="h-10 rounded border px-3" />
        <input placeholder="ИНН" className="h-10 rounded border px-3" />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input placeholder="Банк/БИК" className="h-10 rounded border px-3" />
        <input placeholder="Р/счёт" className="h-10 rounded border px-3" />
      </div>
    </section>
  );
}

function ReviewBlock() {
  return (
    <section className="bg-white rounded border p-4 grid gap-3">
      <h2 className="font-bold">Проверка и публикация</h2>
      <div className="text-sm text-slate-600">Проверьте данные и отправьте на модерацию. После публикации объект появится в каталоге.</div>
      <button className="px-4 py-2 rounded bg-green-600 text-white w-fit">Отправить на модерацию</button>
    </section>
  );
}

