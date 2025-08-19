const MOCK_LISTINGS = [
  { id: '101', city: 'Москва', name: 'Студия у Парка Горького', rating: 4.7, reviews: 312, priceRub: 4200, address: 'Крымский Вал, 9', freeCancel: true },
  { id: '102', city: 'Москва', name: 'Апартаменты на Арбате', rating: 4.8, reviews: 523, priceRub: 6100, address: 'Арбат, 25', freeCancel: false },
  { id: '103', city: 'Москва', name: 'Лофт у Китай‑Города', rating: 4.5, reviews: 198, priceRub: 3800, address: 'Маросейка, 7', freeCancel: true },
  { id: '104', city: 'Санкт‑Петербург', name: 'Вид на каналы', rating: 4.9, reviews: 801, priceRub: 7200, address: 'Наб. канала Грибоедова, 50', freeCancel: true },
  { id: '105', city: 'Сочи', name: 'Терраса у моря', rating: 4.6, reviews: 267, priceRub: 5400, address: 'Приморская, 3', freeCancel: false }
];

export function calculateNights(checkIn, checkOut) {
  const a = new Date(checkIn + 'T12:00:00Z');
  const b = new Date(checkOut + 'T12:00:00Z');
  const diff = Math.max(0, b - a);
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

export function getMockSearchResults({ where, checkIn, checkOut, guests, minPrice, maxPrice, minRating, onlyFreeCancel }) {
  const nights = calculateNights(checkIn, checkOut);
  let base = MOCK_LISTINGS.filter(l => l.city.toLowerCase().includes(where.toLowerCase()));
  if (Number.isFinite(minPrice)) base = base.filter(l => l.priceRub >= minPrice);
  if (Number.isFinite(maxPrice)) base = base.filter(l => l.priceRub <= maxPrice);
  if (Number.isFinite(minRating)) base = base.filter(l => l.rating >= minRating);
  if (onlyFreeCancel) base = base.filter(l => l.freeCancel);
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

