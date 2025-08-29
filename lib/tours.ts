export interface Tour {
  id: string;
  title: string;
  operatorId: string;
  activity: string;
  region: string;
  priceFrom: number;
  durationDays: number;
  rating?: number;
  slots?: number;
  description?: string;
}

const mockTours: Tour[] = [
  { id: 't1', title: 'Вулканы и гейзеры', operatorId: 'op2', activity: 'Вулканы', region: 'Мутновский', priceFrom: 45000, durationDays: 3, rating: 4.7 },
  { id: 't2', title: 'Медвежьи места', operatorId: 'op1', activity: 'Дикая природа', region: 'Курильское озеро', priceFrom: 60000, durationDays: 2, rating: 4.8 },
  { id: 't3', title: 'Морская прогулка', operatorId: 'op3', activity: 'Море', region: 'Авачинская бухта', priceFrom: 8000, durationDays: 1, rating: 4.5 },
  { id: 't4', title: 'Восхождение на Авачинский', operatorId: 'op2', activity: 'Трекинг', region: 'Авачинский', priceFrom: 35000, durationDays: 2, rating: 4.6 },
];

export interface TourQuery {
  q?: string;
  activity?: string;
  region?: string;
  priceMin?: number;
  priceMax?: number;
  daysMin?: number;
  daysMax?: number;
  sort?: 'price-asc' | 'price-desc' | 'rating-desc' | 'duration-asc';
}

export async function searchTours(query: TourQuery = {}): Promise<Tour[]> {
  await new Promise(r => setTimeout(r, 200));
  let result = [...mockTours];

  if (query.q) {
    const x = query.q.toLowerCase();
    result = result.filter(t => t.title.toLowerCase().includes(x) || t.description?.toLowerCase().includes(x));
  }
  if (query.activity) result = result.filter(t => t.activity === query.activity);
  if (query.region) result = result.filter(t => t.region === query.region);
  if (typeof query.priceMin === 'number') result = result.filter(t => t.priceFrom >= query.priceMin!);
  if (typeof query.priceMax === 'number') result = result.filter(t => t.priceFrom <= query.priceMax!);
  if (typeof query.daysMin === 'number') result = result.filter(t => t.durationDays >= query.daysMin!);
  if (typeof query.daysMax === 'number') result = result.filter(t => t.durationDays <= query.daysMax!);

  switch (query.sort) {
    case 'price-asc': result.sort((a, b) => a.priceFrom - b.priceFrom); break;
    case 'price-desc': result.sort((a, b) => b.priceFrom - a.priceFrom); break;
    case 'rating-desc': result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
    case 'duration-asc': result.sort((a, b) => a.durationDays - b.durationDays); break;
  }

  return result;
}

export const activities = ['Вулканы', 'Дикая природа', 'Море', 'Трекинг'];
export const regions = ['Мутновский', 'Курильское озеро', 'Авачинская бухта', 'Авачинский'];

