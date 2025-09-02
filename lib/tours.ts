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
  imageUrl?: string;
}

const mockTours: Tour[] = [
  { id: 't1', title: 'Вулканы и гейзеры', operatorId: 'op2', activity: 'Вулканы', region: 'Мутновский', priceFrom: 45000, durationDays: 3, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop' },
  { id: 't2', title: 'Медвежьи места', operatorId: 'op1', activity: 'Дикая природа', region: 'Курильское озеро', priceFrom: 60000, durationDays: 2, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1501706362039-c06b2d715385?q=80&w=1200&auto=format&fit=crop' },
  { id: 't3', title: 'Морская прогулка', operatorId: 'op3', activity: 'Море', region: 'Авачинская бухта', priceFrom: 8000, durationDays: 1, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1529119368496-2dfda6ec2804?q=80&w=1200&auto=format&fit=crop' },
  { id: 't4', title: 'Восхождение на Авачинский', operatorId: 'op2', activity: 'Трекинг', region: 'Авачинский', priceFrom: 35000, durationDays: 2, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop' },
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
  try {
    const { supabase } = await import('./supabase');
    if (supabase) {
      let q = supabase.from('tours').select('*');
      if (query.q) q = q.ilike('title', `%${query.q}%`);
      if (query.activity) q = q.eq('activity', query.activity);
      if (query.region) q = q.eq('region', query.region);
      const { data, error } = await q;
      if (!error && data) {
        let result = data as Tour[];
        // client-side filters for price/days and sorting
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
    }
  } catch {}
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

export async function getTourById(id: string): Promise<Tour | null> {
  try {
    const { supabase } = await import('./supabase');
    if (supabase) {
      const { data, error } = await supabase.from('tours').select('*').eq('id', id).maybeSingle<Tour>();
      if (!error && data) return data as Tour;
    }
  } catch {}
  const all = await searchTours();
  return all.find(t => t.id === id) ?? null;
}

