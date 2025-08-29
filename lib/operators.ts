export interface Operator {
  id: string;
  name: string;
  website?: string;
  email?: string;
  phone?: string;
  regions?: string[];
  activities?: string[];
  verified?: boolean;
  partnerLevel?: 'none' | 'partner' | 'official';
  score?: number;
  logoUrl?: string;
  description?: string;
}

const mockOperators: Operator[] = [
  {
    id: 'op1',
    name: 'Камчатка-Тур',
    website: 'https://example.com',
    phone: '+7 900 000-00-01',
    regions: ['Петропавловск-Камчатский'],
    activities: ['Вулканы', 'Трекинг', 'Медведи'],
    verified: true,
    partnerLevel: 'partner',
    score: 82,
    description: 'Экспертные туры по Камчатке, безопасность и сертифицированные гиды.'
  },
  {
    id: 'op2',
    name: 'Вулканы Камчатки',
    website: 'https://example.org',
    phone: '+7 900 000-00-02',
    regions: ['Елизово', 'Мутновский'],
    activities: ['Джип-туры', 'Снегоходы'],
    verified: true,
    partnerLevel: 'official',
    score: 90,
    description: 'Официальный оператор маршрутов к вулканам и гейзерам.'
  },
  {
    id: 'op3',
    name: 'Морские Экспедиции',
    website: 'https://example.net',
    phone: '+7 900 000-00-03',
    regions: ['Авачинская бухта'],
    activities: ['Морские прогулки', 'Киты', 'Птицы'],
    partnerLevel: 'none',
    score: 74,
    description: 'Морские туры и наблюдение за морскими обитателями.'
  }
];

export async function listOperators(query?: { search?: string; region?: string; activity?: string; verified?: boolean }): Promise<Operator[]> {
  await new Promise(r => setTimeout(r, 300));
  let result = [...mockOperators];
  if (query?.search) {
    const q = query.search.toLowerCase();
    result = result.filter(o => o.name.toLowerCase().includes(q) || o.description?.toLowerCase().includes(q));
  }
  if (query?.region) {
    result = result.filter(o => o.regions?.includes(query.region!));
  }
  if (query?.activity) {
    result = result.filter(o => o.activities?.includes(query.activity!));
  }
  if (typeof query?.verified === 'boolean') {
    result = result.filter(o => !!o.verified === query.verified);
  }
  return result;
}

export async function getOperatorById(id: string): Promise<Operator | null> {
  await new Promise(r => setTimeout(r, 200));
  return mockOperators.find(o => o.id === id) ?? null;
}

export interface InquiryPayload {
  operatorId: string;
  name: string;
  email: string;
  message: string;
}

export async function sendOperatorInquiry(payload: InquiryPayload): Promise<{ success: boolean }>{
  await new Promise(r => setTimeout(r, 400));
  console.log('Operator inquiry:', payload);
  return { success: true };
}

