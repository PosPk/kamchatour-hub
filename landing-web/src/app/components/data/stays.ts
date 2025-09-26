export type Stay = {
  id: string;
  title: string;
  type: 'Отель' | 'Гостевой дом' | 'Апартаменты' | 'Хостел' | 'Частный дом' | 'Вилла';
  location: string;
  coords: [number, number]; // [lat, lng]
  distanceKm?: number;
  rating: number; // 0..5
  stars: number; // 1..5
  reviews: number;
  priceFrom: number; // per night
  images: string[];
  amenities: string[];
  description: string;
};

// Rough city centers
export const CITY_CENTERS: Record<string, [number, number]> = {
  'Петропавловск‑Камчатский': [53.04444, 158.65000],
  'Елизово': [53.18333, 158.38333],
  'Паратунка': [52.96667, 158.23333],
  'Мильково': [54.71667, 158.61667],
};

export const STAYS: Stay[] = [
  {
    id: 'avacha-hotel',
    title: 'Гостиница «Авача»',
    type: 'Отель',
    location: 'Петропавловск‑Камчатский',
    coords: [53.0499, 158.6481],
    rating: 4.3,
    stars: 3,
    reviews: 842,
    priceFrom: 4800,
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop'
    ],
    amenities: ['Бесплатный Wi‑Fi', 'Парковка', 'Питание включено'],
    description: 'Классический отель в центре города с видом на вулканы, уютные номера и завтрак включён.'
  },
  {
    id: 'river-lodge',
    title: 'River Lodge',
    type: 'Гостевой дом',
    location: 'р. Камчатка (Елизовский район)',
    coords: [53.35, 158.55],
    rating: 4.9,
    stars: 4,
    reviews: 211,
    priceFrom: 5800,
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1200&auto=format&fit=crop'
    ],
    amenities: ['Бесплатный Wi‑Fi', 'Трансфер', 'Питание включено', 'Размещение с животными'],
    description: 'Гостевой дом на берегу реки Камчатка. Идеально для рыбалки и отдыха на природе.'
  },
  {
    id: 'volcano-view',
    title: 'Volcano View Apartments',
    type: 'Апартаменты',
    location: 'Петропавловск‑Камчатский',
    coords: [53.053, 158.66],
    rating: 4.7,
    stars: 4,
    reviews: 356,
    priceFrom: 3500,
    images: [
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551776235-dde6d4829808?q=80&w=1200&auto=format&fit=crop'
    ],
    amenities: ['Бесплатный Wi‑Fi', 'Парковка'],
    description: 'Современные апартаменты с балконами и панорамным видом на Корякский и Авачинский вулканы.'
  },
  {
    id: 'paratunka-spa',
    title: 'Паратунка SPA Hotel',
    type: 'Отель',
    location: 'Паратунка',
    coords: [52.955, 158.238],
    rating: 4.6,
    stars: 4,
    reviews: 512,
    priceFrom: 7200,
    images: [
      'https://images.unsplash.com/photo-1551776235-dde6d4829808?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=1200&auto=format&fit=crop'
    ],
    amenities: ['Термальный бассейн', 'Спа‑услуги', 'Парковка', 'Бесплатный Wi‑Fi'],
    description: 'Курортный отель с термальными бассейнами под открытым небом и полноценным SPA.'
  },
  {
    id: 'elizo-inn',
    title: 'Elizo Inn',
    type: 'Гостевой дом',
    location: 'Елизово',
    coords: [53.18, 158.37],
    rating: 4.4,
    stars: 3,
    reviews: 189,
    priceFrom: 3100,
    images: [
      'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop'
    ],
    amenities: ['Бесплатный Wi‑Fi', 'Парковка', 'Трансфер'],
    description: 'Уютные номера рядом с аэропортом, удобны для ранних вылетов и поздних прилётов.'
  },
  {
    id: 'ocean-breeze',
    title: 'Ocean Breeze Villa',
    type: 'Вилла',
    location: 'Петропавловск‑Камчатский',
    coords: [53.06, 158.72],
    rating: 4.8,
    stars: 5,
    reviews: 76,
    priceFrom: 14500,
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop'
    ],
    amenities: ['Бесплатный Wi‑Fi', 'Парковка', 'Питание включено'],
    description: 'Просторная вилла на океане с террасой и видом на Авачинскую бухту.'
  },
  {
    id: 'hostel-koryak',
    title: 'Hostel Koryak',
    type: 'Хостел',
    location: 'Петропавловск‑Камчатский',
    coords: [53.04, 158.63],
    rating: 4.1,
    stars: 2,
    reviews: 421,
    priceFrom: 1200,
    images: [
      'https://images.unsplash.com/photo-1505692794403-34f23bd4f3e9?q=80&w=1200&auto=format&fit=crop'
    ],
    amenities: ['Бесплатный Wi‑Fi'],
    description: 'Доступное размещение для путешественников с общими зонами и кухней.'
  },
  {
    id: 'green-hills-house',
    title: 'Green Hills House',
    type: 'Частный дом',
    location: 'Елизово',
    coords: [53.21, 158.37],
    rating: 4.5,
    stars: 3,
    reviews: 98,
    priceFrom: 4200,
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop'
    ],
    amenities: ['Парковка', 'Размещение с животными'],
    description: 'Дом с садом и баней, тихая улочка и быстрый выезд к природе.'
  },
  {
    id: 'milkovsky-dvor',
    title: 'Мильковский Двор',
    type: 'Гостевой дом',
    location: 'Мильково',
    coords: [54.716, 158.616],
    rating: 4.3,
    stars: 3,
    reviews: 67,
    priceFrom: 2600,
    images: [
      'https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=1200&auto=format&fit=crop'
    ],
    amenities: ['Парковка', 'Питание включено'],
    description: 'Уютная сельская локация, домашняя кухня и радушные хозяева.'
  },
  {
    id: 'paratunka-lodge',
    title: 'Paratunka Lodge',
    type: 'Гостевой дом',
    location: 'Паратунка',
    coords: [52.961, 158.249],
    rating: 4.7,
    stars: 4,
    reviews: 144,
    priceFrom: 6800,
    images: [
      'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop'
    ],
    amenities: ['Термальный бассейн', 'Спа‑услуги', 'Бесплатный Wi‑Fi'],
    description: 'Горячие источники рядом, бассейны с термальной водой и виды на сопки.'
  },
  {
    id: 'vulkan-hotel',
    title: 'Vulkan Hotel',
    type: 'Отель',
    location: 'Петропавловск‑Камчатский',
    coords: [53.03, 158.67],
    rating: 4.6,
    stars: 4,
    reviews: 302,
    priceFrom: 5900,
    images: [
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1200&auto=format&fit=crop'
    ],
    amenities: ['Бесплатный Wi‑Fi', 'Парковка', 'Питание включено'],
    description: 'Отель с современными номерами и рестораном, удобен для деловых поездок.'
  },
  {
    id: 'ocean-hostel',
    title: 'Ocean Hostel',
    type: 'Хостел',
    location: 'Петропавловск‑Камчатский',
    coords: [53.05, 158.62],
    rating: 4.0,
    stars: 2,
    reviews: 255,
    priceFrom: 1100,
    images: [
      'https://images.unsplash.com/photo-1505692794403-34f23bd4f3e9?q=80&w=1200&auto=format&fit=crop'
    ],
    amenities: ['Бесплатный Wi‑Fi'],
    description: 'Бюджетный вариант рядом с остановками, чисто и аккуратно.'
  },
  {
    id: 'petro-aparts',
    title: 'Petro Aparts',
    type: 'Апартаменты',
    location: 'Петропавловск‑Камчатский',
    coords: [53.07, 158.65],
    rating: 4.5,
    stars: 4,
    reviews: 198,
    priceFrom: 4200,
    images: [
      'https://images.unsplash.com/photo-1551776235-dde6d4829808?q=80&w=1200&auto=format&fit=crop'
    ],
    amenities: ['Бесплатный Wi‑Fi', 'Парковка'],
    description: 'Стильные апартаменты с полноценной кухней и само‑заселением.'
  },
];

export function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371; // km
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

