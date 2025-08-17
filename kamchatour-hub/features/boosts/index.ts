export interface Boost {
  id: string;
  name: string;
  type: BoostType;
  category: BoostCategory;
  description: string;
  price: number;
  duration: number; // в часах
  maxParticipants: number;
  availability: AvailabilityStatus;
  location: [number, number];
  requirements: string[];
  included: string[];
  excluded: string[];
  images: string[];
  rating: number; // 0-5
  reviews: BoostReview[];
  provider: BoostProvider;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type BoostType = 
  | 'experience' | 'convenience' | 'safety' | 'luxury' | 'exclusive' | 'group';

export type BoostCategory = 
  | 'helicopter' | 'guide' | 'transport' | 'accommodation' | 'activities' | 'food' | 'equipment';

export type AvailabilityStatus = 
  | 'available' | 'limited' | 'unavailable' | 'seasonal' | 'weather_dependent';

export interface BoostReview {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  photos: string[];
  createdAt: Date;
  helpful: number;
}

export interface BoostProvider {
  id: string;
  name: string;
  type: 'company' | 'individual' | 'government';
  rating: number;
  verified: boolean;
  experience: number; // годы опыта
  licenses: string[];
  insurance: boolean;
  contactInfo: ContactInfo;
  website?: string;
  logo: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  whatsapp?: string;
  telegram?: string;
  instagram?: string;
}

export interface BoostBooking {
  id: string;
  boostId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  participants: number;
  totalPrice: number;
  status: BookingStatus;
  specialRequests: string[];
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingStatus = 
  | 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'refunded';

export type PaymentStatus = 
  | 'pending' | 'paid' | 'failed' | 'refunded' | 'partial';

export class BoostSystem {
  private boosts: Map<string, Boost> = new Map();
  private bookings: Map<string, BoostBooking> = new Map();
  private providers: Map<string, BoostProvider> = new Map();
  private boostRecommender: BoostRecommender;
  private availabilityChecker: AvailabilityChecker;
  private pricingEngine: PricingEngine;

  constructor() {
    this.initializeBoostSystem();
  }

  private async initializeBoostSystem() {
    console.log('💪 Инициализация системы бустов и дополнительных услуг...');
    
    await this.initializeBoostRecommender();
    await this.initializeAvailabilityChecker();
    await this.initializePricingEngine();
    await this.loadBoostProviders();
    await this.loadDefaultBoosts();
    
    console.log('✅ Система бустов готова!');
  }

  private async initializeBoostRecommender(): Promise<void> {
    this.boostRecommender = new BoostRecommender();
    await this.boostRecommender.initialize();
  }

  private async initializeAvailabilityChecker(): Promise<void> {
    this.availabilityChecker = new AvailabilityChecker();
    await this.availabilityChecker.initialize();
  }

  private async initializePricingEngine(): Promise<void> {
    this.pricingEngine = new PricingEngine();
    await this.pricingEngine.initialize();
  }

  private async loadBoostProviders(): Promise<void> {
    // Загрузка провайдеров бустов на Камчатке
    const providers: BoostProvider[] = [
      {
        id: 'kamchatka_helicopters',
        name: 'Камчатские Вертолеты',
        type: 'company',
        rating: 4.8,
        verified: true,
        experience: 15,
        licenses: ['Авиационная лицензия', 'Туристическая лицензия'],
        insurance: true,
        contactInfo: {
          phone: '+7-415-200-0000',
          email: 'info@kamchatka-helicopters.ru',
          whatsapp: '+7-900-000-0000',
          telegram: '@kamchatka_helicopters'
        },
        website: 'https://kamchatka-helicopters.ru',
        logo: 'kamchatka-helicopters-logo.png'
      },
      {
        id: 'bear_experts',
        name: 'Эксперты по Медведям',
        type: 'company',
        rating: 4.9,
        verified: true,
        experience: 20,
        licenses: ['Биологическая лицензия', 'Туристическая лицензия'],
        insurance: true,
        contactInfo: {
          phone: '+7-415-200-0001',
          email: 'info@bear-experts.ru',
          whatsapp: '+7-900-000-0001',
          telegram: '@bear_experts'
        },
        website: 'https://bear-experts.ru',
        logo: 'bear-experts-logo.png'
      },
      {
        id: 'volcano_guides',
        name: 'Гиды по Вулканам',
        type: 'company',
        rating: 4.7,
        verified: true,
        experience: 12,
        licenses: ['Геологическая лицензия', 'Туристическая лицензия'],
        insurance: true,
        contactInfo: {
          phone: '+7-415-200-0002',
          email: 'info@volcano-guides.ru',
          whatsapp: '+7-900-000-0002',
          telegram: '@volcano_guides'
        },
        website: 'https://volcano-guides.ru',
        logo: 'volcano-guides-logo.png'
      },
      {
        id: 'kamchatka_luxury',
        name: 'Камчатская Роскошь',
        type: 'company',
        rating: 5.0,
        verified: true,
        experience: 8,
        licenses: ['Туристическая лицензия', 'Ресторанная лицензия'],
        insurance: true,
        contactInfo: {
          phone: '+7-415-200-0003',
          email: 'info@kamchatka-luxury.ru',
          whatsapp: '+7-900-000-0003',
          telegram: '@kamchatka_luxury'
        },
        website: 'https://kamchatka-luxury.ru',
        logo: 'kamchatka-luxury-logo.png'
      }
    ];

    providers.forEach(provider => {
      this.providers.set(provider.id, provider);
    });
  }

  private async loadDefaultBoosts(): Promise<void> {
    // Загрузка стандартных бустов для Камчатки
    const defaultBoosts: Boost[] = [
      {
        id: 'helicopter_volcano_tour',
        name: 'Вертолетный тур к вулканам',
        type: 'experience',
        category: 'helicopter',
        description: 'Эксклюзивный вертолетный тур к самым красивым вулканам Камчатки с посадкой и прогулкой',
        price: 25000,
        duration: 4,
        maxParticipants: 6,
        availability: 'weather_dependent',
        location: [56.1327, 158.3803], // Ключевская сопка
        requirements: ['Возраст 18+', 'Хорошая физическая форма', 'Теплая одежда'],
        included: ['Вертолет', 'Пилот', 'Гид-геолог', 'Обед', 'Страховка', 'Фотосъемка'],
        excluded: ['Личные расходы', 'Сувениры'],
        images: ['helicopter_volcano_1.jpg', 'helicopter_volcano_2.jpg'],
        rating: 4.9,
        reviews: [],
        provider: this.providers.get('kamchatka_helicopters')!,
        tags: ['вертолет', 'вулкан', 'эксклюзив', 'геология'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'bear_watching_premium',
        name: 'Премиум наблюдение за медведями',
        type: 'exclusive',
        category: 'activities',
        description: 'Эксклюзивное наблюдение за медведями в дикой природе с профессиональными биологами',
        price: 15000,
        duration: 8,
        maxParticipants: 4,
        availability: 'seasonal',
        location: [51.4567, 157.1234], // Курильское озеро
        requirements: ['Возраст 16+', 'Тишина', 'Терпение'],
        included: ['Трансфер', 'Биолог-гид', 'Оборудование', 'Обед', 'Страховка', 'Фотосъемка'],
        excluded: ['Личные расходы', 'Сувениры'],
        images: ['bear_watching_1.jpg', 'bear_watching_2.jpg'],
        rating: 4.9,
        reviews: [],
        provider: this.providers.get('bear_experts')!,
        tags: ['медведи', 'дикая природа', 'биология', 'фотоохота'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'volcano_climbing_guide',
        name: 'Персональный гид для восхождения на вулкан',
        type: 'safety',
        category: 'guide',
        description: 'Индивидуальный гид для безопасного восхождения на вулкан с полным снаряжением',
        price: 8000,
        duration: 12,
        maxParticipants: 2,
        availability: 'weather_dependent',
        location: [56.1327, 158.3803], // Ключевская сопка
        requirements: ['Возраст 18+', 'Отличная физическая форма', 'Опыт горных походов'],
        included: ['Персональный гид', 'Снаряжение', 'Страховка', 'Питание', 'Трансфер'],
        excluded: ['Личные расходы', 'Сувениры'],
        images: ['volcano_climbing_1.jpg', 'volcano_climbing_2.jpg'],
        rating: 4.8,
        reviews: [],
        provider: this.providers.get('volcano_guides')!,
        tags: ['вулкан', 'восхождение', 'гид', 'безопасность'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'luxury_thermal_bath',
        name: 'Роскошные термальные ванны',
        type: 'luxury',
        category: 'accommodation',
        description: 'Эксклюзивные термальные ванны с видом на вулканы и VIP обслуживанием',
        price: 12000,
        duration: 3,
        maxParticipants: 2,
        availability: 'available',
        location: [52.9876, 158.5678], // Паратунка
        requirements: ['Бронирование за 24 часа', 'Возраст 18+'],
        included: ['Приватные термальные ванны', 'VIP обслуживание', 'Шампанское', 'Массаж', 'Ужин'],
        excluded: ['Трансфер', 'Личные расходы'],
        images: ['thermal_bath_1.jpg', 'thermal_bath_2.jpg'],
        rating: 5.0,
        reviews: [],
        provider: this.providers.get('kamchatka_luxury')!,
        tags: ['термальные источники', 'роскошь', 'VIP', 'релакс'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'fishing_masterclass',
        name: 'Мастер-класс по рыбалке на Камчатке',
        type: 'experience',
        category: 'activities',
        description: 'Обучение рыбалке на лосося с профессиональными рыбаками в диких реках',
        price: 6000,
        duration: 6,
        maxParticipants: 3,
        availability: 'seasonal',
        location: [53.1234, 158.7890], // Река Камчатка
        requirements: ['Возраст 16+', 'Рыболовная лицензия', 'Теплая одежда'],
        included: ['Снаряжение', 'Профессиональный рыбак', 'Лицензия', 'Обед', 'Трансфер'],
        excluded: ['Личные расходы', 'Сувениры'],
        images: ['fishing_1.jpg', 'fishing_2.jpg'],
        rating: 4.7,
        reviews: [],
        provider: this.providers.get('bear_experts')!,
        tags: ['рыбалка', 'лосось', 'обучение', 'дикая природа'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    defaultBoosts.forEach(boost => {
      this.boosts.set(boost.id, boost);
    });
  }

  async getBoosts(
    filters?: BoostFilters,
    location?: [number, number],
    radius?: number
  ): Promise<Boost[]> {
    
    let filteredBoosts = Array.from(this.boosts.values());
    
    // Применение фильтров
    if (filters) {
      filteredBoosts = this.applyFilters(filteredBoosts, filters);
    }
    
    // Фильтрация по местоположению
    if (location && radius) {
      filteredBoosts = filteredBoosts.filter(boost => 
        this.isWithinRadius(boost.location, location, radius)
      );
    }
    
    // Проверка доступности
    filteredBoosts = await this.checkAvailability(filteredBoosts);
    
    // Сортировка по рейтингу и цене
    return filteredBoosts.sort((a, b) => {
      const ratingScore = b.rating - a.rating;
      const priceScore = a.price - b.price;
      return ratingScore * 10 + priceScore * 0.001;
    });
  }

  private applyFilters(boosts: Boost[], filters: BoostFilters): Boost[] {
    return boosts.filter(boost => {
      if (filters.type && boost.type !== filters.type) return false;
      if (filters.category && boost.category !== filters.category) return false;
      if (filters.maxPrice && boost.price > filters.maxPrice) return false;
      if (filters.minRating && boost.rating < filters.minRating) return false;
      if (filters.availability && boost.availability !== filters.availability) return false;
      if (filters.tags && !filters.tags.some(tag => boost.tags.includes(tag))) return false;
      return true;
    });
  }

  private isWithinRadius(
    boostLocation: [number, number], 
    userLocation: [number, number], 
    radius: number
  ): boolean {
    const distance = this.calculateDistance(boostLocation, userLocation);
    return distance <= radius;
  }

  private calculateDistance(
    point1: [number, number], 
    point2: [number, number]
  ): number {
    const R = 6371; // радиус Земли в км
    const dLat = (point2[0] - point1[0]) * Math.PI / 180;
    const dLon = (point2[1] - point1[1]) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1[0] * Math.PI / 180) * Math.cos(point2[0] * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private async checkAvailability(boosts: Boost[]): Promise<Boost[]> {
    const availableBoosts: Boost[] = [];
    
    for (const boost of boosts) {
      const isAvailable = await this.availabilityChecker.checkBoostAvailability(boost);
      if (isAvailable) {
        availableBoosts.push(boost);
      }
    }
    
    return availableBoosts;
  }

  async getBoostRecommendations(
    userId: string,
    tripDetails: TripDetails,
    preferences: UserPreferences
  ): Promise<Boost[]> {
    
    return await this.boostRecommender.getRecommendations(
      userId,
      tripDetails,
      preferences,
      Array.from(this.boosts.values())
    );
  }

  async bookBoost(
    boostId: string,
    userId: string,
    bookingDetails: BookingDetails
  ): Promise<BoostBooking> {
    
    const boost = this.boosts.get(boostId);
    if (!boost) {
      throw new Error('Буст не найден');
    }
    
    // Проверка доступности
    const isAvailable = await this.availabilityChecker.checkBoostAvailability(boost);
    if (!isAvailable) {
      throw new Error('Буст недоступен на указанную дату');
    }
    
    // Расчет цены
    const totalPrice = await this.pricingEngine.calculatePrice(boost, bookingDetails);
    
    const booking: BoostBooking = {
      id: this.generateBookingId(),
      boostId,
      userId,
      startDate: bookingDetails.startDate,
      endDate: bookingDetails.endDate,
      participants: bookingDetails.participants,
      totalPrice,
      status: 'pending',
      specialRequests: bookingDetails.specialRequests || [],
      paymentStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.bookings.set(booking.id, booking);
    
    return booking;
  }

  async getBoost(boostId: string): Promise<Boost | null> {
    return this.boosts.get(boostId) || null;
  }

  async getBooking(bookingId: string): Promise<BoostBooking | null> {
    return this.bookings.get(bookingId) || null;
  }

  async getUserBookings(userId: string): Promise<BoostBooking[]> {
    return Array.from(this.bookings.values())
      .filter(booking => booking.userId === userId);
  }

  async cancelBooking(bookingId: string, userId: string): Promise<boolean> {
    const booking = this.bookings.get(bookingId);
    if (!booking || booking.userId !== userId) {
      return false;
    }
    
    if (booking.status === 'confirmed' || booking.status === 'pending') {
      booking.status = 'cancelled';
      booking.updatedAt = new Date();
      return true;
    }
    
    return false;
  }

  async addBoostReview(
    boostId: string,
    userId: string,
    review: Omit<BoostReview, 'id' | 'createdAt' | 'helpful'>
  ): Promise<BoostReview> {
    
    const boost = this.boosts.get(boostId);
    if (!boost) {
      throw new Error('Буст не найден');
    }
    
    const newReview: BoostReview = {
      id: this.generateReviewId(),
      userId,
      rating: review.rating,
      comment: review.comment,
      photos: review.photos,
      createdAt: new Date(),
      helpful: 0
    };
    
    boost.reviews.push(newReview);
    
    // Обновление рейтинга буста
    const totalRating = boost.reviews.reduce((sum, r) => sum + r.rating, 0);
    boost.rating = totalRating / boost.reviews.length;
    boost.updatedAt = new Date();
    
    return newReview;
  }

  private generateBookingId(): string {
    return `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateReviewId(): string {
    return `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Вспомогательные классы
class BoostRecommender {
  async initialize(): Promise<void> {
    console.log('Инициализация рекомендательной системы бустов...');
  }

  async getRecommendations(
    userId: string,
    tripDetails: TripDetails,
    preferences: UserPreferences,
    availableBoosts: Boost[]
  ): Promise<Boost[]> {
    // Алгоритм рекомендаций на основе предпочтений и деталей поездки
    const scoredBoosts = availableBoosts.map(boost => ({
      boost,
      score: this.calculateBoostScore(boost, tripDetails, preferences)
    }));
    
    return scoredBoosts
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(item => item.boost);
  }

  private calculateBoostScore(
    boost: Boost, 
    tripDetails: TripDetails, 
    preferences: UserPreferences
  ): number {
    let score = boost.rating * 2; // базовый рейтинг
    
    // Соответствие предпочтениям
    if (preferences.luxury && boost.type === 'luxury') score += 3;
    if (preferences.adventure && boost.type === 'experience') score += 3;
    if (preferences.safety && boost.type === 'safety') score += 2;
    
    // Соответствие сезону
    if (boost.availability === 'seasonal' && this.isSeasonAppropriate(boost, tripDetails.season)) {
      score += 2;
    }
    
    // Соответствие бюджету
    if (boost.price <= tripDetails.budget * 0.3) score += 2;
    
    return score;
  }

  private isSeasonAppropriate(boost: Boost, season: string): boolean {
    // Логика соответствия сезону
    return true; // упрощенная версия
  }
}

class AvailabilityChecker {
  async initialize(): Promise<void> {
    console.log('Инициализация проверки доступности...');
  }

  async checkBoostAvailability(boost: Boost): Promise<boolean> {
    // Проверка доступности буста
    if (boost.availability === 'unavailable') return false;
    if (boost.availability === 'weather_dependent') {
      return await this.checkWeatherConditions(boost.location);
    }
    return true;
  }

  private async checkWeatherConditions(location: [number, number]): Promise<boolean> {
    // Проверка погодных условий
    return Math.random() > 0.3; // 70% вероятность хорошей погоды
  }
}

class PricingEngine {
  async initialize(): Promise<void> {
    console.log('Инициализация системы ценообразования...');
  }

  async calculatePrice(boost: Boost, bookingDetails: BookingDetails): Promise<number> {
    let basePrice = boost.price;
    
    // Множители цены
    if (bookingDetails.participants > 1) {
      basePrice *= (1 + (bookingDetails.participants - 1) * 0.1); // 10% за каждого дополнительного участника
    }
    
    // Сезонные коэффициенты
    const season = this.getSeason(bookingDetails.startDate);
    if (season === 'winter') {
      basePrice *= 1.2; // зимой дороже
    } else if (season === 'summer') {
      basePrice *= 1.1; // летом немного дороже
    }
    
    // Скидки за раннее бронирование
    const daysUntilTrip = this.getDaysUntilTrip(bookingDetails.startDate);
    if (daysUntilTrip > 30) {
      basePrice *= 0.9; // 10% скидка за раннее бронирование
    }
    
    return Math.round(basePrice);
  }

  private getSeason(date: Date): string {
    const month = date.getMonth();
    if (month >= 11 || month <= 2) return 'winter';
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    return 'autumn';
  }

  private getDaysUntilTrip(startDate: Date): number {
    const now = new Date();
    const diffTime = startDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

// Интерфейсы
export interface BoostFilters {
  type?: BoostType;
  category?: BoostCategory;
  maxPrice?: number;
  minRating?: number;
  availability?: AvailabilityStatus;
  tags?: string[];
}

export interface TripDetails {
  startDate: Date;
  endDate: Date;
  season: string;
  budget: number;
  participants: number;
  activities: string[];
}

export interface UserPreferences {
  luxury: boolean;
  adventure: boolean;
  safety: boolean;
  budget: boolean;
  comfort: boolean;
}

export interface BookingDetails {
  startDate: Date;
  endDate: Date;
  participants: number;
  specialRequests?: string[];
}

// Экспорт системы
export const boostSystem = new BoostSystem();

export function getBoosts(
  filters?: BoostFilters,
  location?: [number, number],
  radius?: number
): Promise<Boost[]> {
  return boostSystem.getBoosts(filters, location, radius);
}

export function getBoostRecommendations(
  userId: string,
  tripDetails: TripDetails,
  preferences: UserPreferences
): Promise<Boost[]> {
  return boostSystem.getBoostRecommendations(userId, tripDetails, preferences);
}

export function bookBoost(
  boostId: string,
  userId: string,
  bookingDetails: BookingDetails
): Promise<BoostBooking> {
  return boostSystem.bookBoost(boostId, userId, bookingDetails);
}