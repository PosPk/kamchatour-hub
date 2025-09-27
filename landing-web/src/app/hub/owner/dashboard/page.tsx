export default function OwnerDashboard() {
  return (
    <div className="grid gap-6">
      <div className="grid sm:grid-cols-4 gap-3">
        {[
          { k: 'Бронирования', v: '12' },
          { k: 'Загрузка', v: '68%' },
          { k: 'Выручка', v: '245 000 ₽' },
          { k: 'Рейтинг', v: '4.6' },
        ].map((c)=> (
          <div key={c.k} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-white/70">{c.k}</div>
            <div className="text-2xl font-black text-premium-gold">{c.v}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-lg font-extrabold mb-2">Ближайшие заезды</div>
        <div className="text-white/70 text-sm">(мок) 3 бронирования в ближайшие дни</div>
      </div>
    </div>
  );
}

