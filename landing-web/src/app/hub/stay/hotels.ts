export type Hotel = {
  id: string;
  name: string;
  location: string;
  coords: { lat: number; lng: number };
  rating: number; // 0-5
  stars: number; // 1-5
  reviews: number;
  type: 'Отель' | 'Гостевой дом' | 'Апартаменты' | 'Хостел' | 'Частный дом' | 'Вилла';
  price: number; // price per night
  distanceKm: number;
  images: string[];
  amenities: string[];
  description: string;
};

export const HOTELS: Hotel[] = [
  {
    id: 'avacha',
    name: 'Гостиница «Авача»',
    location: 'Петропавловск‑Камчатский',
    coords: { lat: 53.037, lng: 158.655 },
    rating: 4.3,
    stars: 3,
    reviews: 412,
    type: 'Отель',
    price: 4500,
    distanceKm: 1.2,
    images: [
      'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop'
    ],
    amenities: ['Бесплатный Wi‑Fi','Парковка','Завтрак','Трансфер'],
    description: 'Уютная городская гостиница рядом с набережной. Номера с видом на вулканы, включён завтрак.'
  },
  {
    id: 'volcano-view',
    name: 'Volcano View Apartments',
    location: 'Петропавловск‑Камчатский',
    coords: { lat: 53.027, lng: 158.676 },
    rating: 4.7,
    stars: 4,
    reviews: 216,
    type: 'Апартаменты',
    price: 5900,
    distanceKm: 2.4,
    images: [
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop'
    ],
    amenities: ['Бесплатный Wi‑Fi','Кухня','Вид на вулканы','Размещение с животными'],
    description: 'Современные апартаменты с панорамным видом на Корякский и Авачинский вулканы.'
  },
  {
    id: 'elizovo-park',
    name: 'Elizovo Park Hotel',
    location: 'Елизово',
    coords: { lat: 53.184, lng: 158.381 },
    rating: 4.5,
    stars: 4,
    reviews: 158,
    type: 'Отель',
    price: 5200,
    distanceKm: 0.8,
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=1600&auto=format&fit=crop'
    ],
    amenities: ['Бесплатный Wi‑Fi','Парковка','Спа‑услуги','Трансфер'],
    description: 'Отель в центре Елизово, рядом с кафе и бассейном. Уютные номера и внимательный персонал.'
  },
  {
    id: 'river-lodge',
    name: 'River Lodge',
    location: 'р. Камчатка',
    coords: { lat: 55.444, lng: 159.600 },
    rating: 4.9,
    stars: 5,
    reviews: 94,
    type: 'Гостевой дом',
    price: 8300,
    distanceKm: 35,
    images: [
      'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f5?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop'
    ],
    amenities: ['Полный пансион','Трансфер','Бесплатный Wi‑Fi','Баня'],
    description: 'Рыболовная база на Камчатке. Полный пансион, баня, трансферы. Идеально для рыбалки.'
  },
  {
    id: 'thermal-villa',
    name: 'Thermal Springs Villa',
    location: 'Паратунка',
    coords: { lat: 52.957, lng: 158.260 },
    rating: 4.6,
    stars: 4,
    reviews: 121,
    type: 'Вилла',
    price: 9900,
    distanceKm: 3.1,
    images: [
      'https://images.unsplash.com/photo-1505691938474-12f4d7ec8d24?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1600&auto=format&fit=crop'
    ],
    amenities: ['Термальный бассейн','Парковка','Бесплатный Wi‑Fi','Питание включено'],
    description: 'Частная вилла с собственным термальным бассейном. Идеальна для семейного отдыха.'
  },
  {
    id: 'hostel-bear',
    name: 'Хостел «Медведь»',
    location: 'Петропавловск‑Камчатский',
    coords: { lat: 53.05, lng: 158.64 },
    rating: 3.9,
    stars: 2,
    reviews: 203,
    type: 'Хостел',
    price: 1800,
    distanceKm: 1.8,
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop'
    ],
    amenities: ['Бесплатный Wi‑Fi','Кухня'],
    description: 'Доступный вариант в центре. Общая кухня, чисто и удобно.'
  },
  {
    id: 'guest-koryak',
    name: 'Гостевой дом «Коряк»',
    location: 'Петропавловск‑Камчатский',
    coords: { lat: 53.01, lng: 158.69 },
    rating: 4.4,
    stars: 3,
    reviews: 77,
    type: 'Гостевой дом',
    price: 3900,
    distanceKm: 4.5,
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop'
    ],
    amenities: ['Парковка','Трансфер','Размещение с животными'],
    description: 'Уютный гостевой дом в спокойном районе, удобный трансфер.'
  },
  {
    id: 'apt-bay',
    name: 'Bay View Апартаменты',
    location: 'Петропавловск‑Камчатский',
    coords: { lat: 53.03, lng: 158.70 },
    rating: 4.8,
    stars: 5,
    reviews: 52,
    type: 'Апартаменты',
    price: 7500,
    distanceKm: 0.9,
    images: [
      'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop'
    ],
    amenities: ['Бесплатный Wi‑Fi','Вид на залив','Кухня'],
    description: 'Просторные апартаменты с видом на Авачинскую бухту.'
  },
  {
    id: 'inn-forest',
    name: 'Forest Inn',
    location: 'Елизово',
    coords: { lat: 53.20, lng: 158.38 },
    rating: 4.1,
    stars: 3,
    reviews: 98,
    type: 'Гостевой дом',
    price: 3100,
    distanceKm: 2.9,
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1600&auto=format&fit=crop'
    ],
    amenities: ['Парковка','Завтрак'],
    description: 'Тихое место рядом с лесом, идеальное для прогулок.'
  },
  {
    id: 'hotel-center',
    name: 'Hotel Center',
    location: 'Петропавловск‑Камчатский',
    coords: { lat: 53.05, lng: 158.62 },
    rating: 4.0,
    stars: 3,
    reviews: 340,
    type: 'Отель',
    price: 3600,
    distanceKm: 0.5,
    images: [
      'https://images.unsplash.com/photo-1568495248636-6432b97bd949?q=80&w=1600&auto=format&fit=crop'
    ],
    amenities: ['Бесплатный Wi‑Fi','Парковка','Завтрак'],
    description: 'Классический городской отель в шаговой доступности от центра.'
  },
  {
    id: 'mount-villa',
    name: 'Mount View Villa',
    location: 'Паратунка',
    coords: { lat: 52.95, lng: 158.27 },
    rating: 4.6,
    stars: 4,
    reviews: 61,
    type: 'Вилла',
    price: 11200,
    distanceKm: 2.1,
    images: [
      'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?q=80&w=1600&auto=format&fit=crop'
    ],
    amenities: ['Термальный бассейн','Спа‑услуги','Парковка'],
    description: 'Элегантная вилла с видом на горы и собственной купелью.'
  },
  {
    id: 'budget-elizovo',
    name: 'Budget Елизово',
    location: 'Елизово',
    coords: { lat: 53.19, lng: 158.37 },
    rating: 3.8,
    stars: 2,
    reviews: 145,
    type: 'Частный дом',
    price: 2200,
    distanceKm: 3.7,
    images: [
      'https://images.unsplash.com/photo-1499696786230-29eefa1d1f17?q=80&w=1600&auto=format&fit=crop'
    ],
    amenities: ['Кухня','Парковка'],
    description: 'Эконом‑проживание для тех, кто весь день в турах.'
  }
];

