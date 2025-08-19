const MOCK_LISTINGS = [
  { id: '101', city: 'Москва', name: 'Студия у Парка Горького', rating: 4.7, reviews: 312, priceRub: 4200, address: 'Крымский Вал, 9' },
  { id: '102', city: 'Москва', name: 'Апартаменты на Арбате', rating: 4.8, reviews: 523, priceRub: 6100, address: 'Арбат, 25' },
  { id: '103', city: 'Москва', name: 'Лофт у Китай‑Города', rating: 4.5, reviews: 198, priceRub: 3800, address: 'Маросейка, 7' },
  { id: '104', city: 'Санкт‑Петербург', name: 'Вид на каналы', rating: 4.9, reviews: 801, priceRub: 7200, address: 'Наб. канала Грибоедова, 50' },
  { id: '105', city: 'Сочи', name: 'Терраса у моря', rating: 4.6, reviews: 267, priceRub: 5400, address: 'Приморская, 3' }
];

export function calculateNights(checkIn, checkOut) {
  const a = new Date(checkIn + 'T12:00:00Z');
  const b = new Date(checkOut + 'T12:00:00Z');
  const diff = Math.max(0, b - a);
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

export function getMockSearchResults({ where, checkIn, checkOut, guests }) {
  const nights = calculateNights(checkIn, checkOut);
  const base = MOCK_LISTINGS.filter(l => l.city.toLowerCase().includes(where.toLowerCase()));
  if (base.length === 0) return MOCK_LISTINGS.slice(0, 3);
  // Sort by a simple score: price + rating signal
  return base
    .map(l => ({ ...l, score: l.priceRub / (l.rating + 3) }))
    .sort((a, b) => a.score - b.score)
    .map(l => ({ ...l, totalRub: l.priceRub * nights }));
}

export function getMockListingById(id) {
  return MOCK_LISTINGS.find(l => l.id === id) || null;
}

