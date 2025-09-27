export default function OwnerProperties() {
  const mock = [
    { id: 'avacha', title: 'Гостиница «Авача»', status: 'активно', rating: 4.3 },
    { id: 'volcano-view', title: 'Volcano View Apartments', status: 'на модерации', rating: 4.7 },
  ];
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-extrabold">Мои объекты</div>
        <a href="/hub/owner/properties/add" className="h-10 px-4 rounded-xl bg-premium-gold text-premium-black font-bold">Добавить объект</a>
      </div>
      <div className="grid gap-2">
        {mock.map(p => (
          <div key={p.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{p.title}</div>
              <div className="text-white/70 text-sm">Статус: {p.status} • Рейтинг: {p.rating}</div>
            </div>
            <div className="flex gap-2">
              <a href={`/hub/owner/properties/${p.id}`} className="px-3 py-2 rounded-lg bg-white/10">Редактировать</a>
              <a href={`/hub/stay/${p.id}`} className="px-3 py-2 rounded-lg bg-white/10">Посмотреть</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

