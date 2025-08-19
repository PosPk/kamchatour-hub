const TRANSFERS = [
  { id: 't301', from: 'Москва', to: 'Аэропорт', vehicle: 'Седан', capacity: 3, company: 'CityDrive', waitMinutes: 10, freeCancel: true, priceRub: 1800 },
  { id: 't302', from: 'Москва', to: 'Аэропорт', vehicle: 'Минивэн', capacity: 6, company: 'TransferPro', waitMinutes: 15, freeCancel: false, priceRub: 2900 },
  { id: 't303', from: 'Сочи', to: 'Аэропорт', vehicle: 'Кроссовер', capacity: 4, company: 'SochiTaxi', waitMinutes: 12, freeCancel: true, priceRub: 2200 }
];

export function getMockTransfers({ from, to, minPrice, maxPrice, onlyFreeCancel }) {
  let base = TRANSFERS.filter(t => t.from.toLowerCase().includes(from.toLowerCase()) && t.to.toLowerCase().includes(to.toLowerCase()))
  if (Number.isFinite(minPrice)) base = base.filter(t => t.priceRub >= minPrice);
  if (Number.isFinite(maxPrice)) base = base.filter(t => t.priceRub <= maxPrice);
  if (onlyFreeCancel) base = base.filter(t => t.freeCancel);
  return base.sort((a, b) => a.priceRub - b.priceRub);
}

export function getMockTransferById(id) {
  return TRANSFERS.find(t => t.id === id) || null;
}

