const ACTIVITIES = [
  { id: 'a201', city: 'Москва', name: 'Экскурсия по Кремлю', rating: 4.8, reviews: 1120, priceRub: 3500, durationHours: 3, freeCancel: true, instant: true },
  { id: 'a202', city: 'Москва', name: 'Речной круиз по Москве-реке', rating: 4.6, reviews: 640, priceRub: 4200, durationHours: 2, freeCancel: true, instant: false },
  { id: 'a203', city: 'Сочи', name: 'Джип-тур в горы', rating: 4.7, reviews: 380, priceRub: 5200, durationHours: 5, freeCancel: false, instant: true },
  { id: 'a204', city: 'Санкт‑Петербург', name: 'Ночные разводные мосты', rating: 4.9, reviews: 1880, priceRub: 2900, durationHours: 1.5, freeCancel: true, instant: true }
];

export function getMockActivities({ where, minPrice, maxPrice, minRating, onlyInstant }) {
  let base = ACTIVITIES.filter(a => a.city.toLowerCase().includes(where.toLowerCase()));
  if (Number.isFinite(minPrice)) base = base.filter(a => a.priceRub >= minPrice);
  if (Number.isFinite(maxPrice)) base = base.filter(a => a.priceRub <= maxPrice);
  if (Number.isFinite(minRating)) base = base.filter(a => a.rating >= minRating);
  if (onlyInstant) base = base.filter(a => a.instant);
  return base
    .map(a => ({ ...a, score: a.priceRub / (a.rating + 3) }))
    .sort((x, y) => x.score - y.score);
}

export function getMockActivityById(id) {
  return ACTIVITIES.find(a => a.id === id) || null;
}

