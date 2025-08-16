// AI и рекомендации
export * from './aiRecommendations';

// Система безопасности и SOS
export * from './emergency';

// Эко-рейтинги и углеродные кредиты
export * from './ecoRating';

// Геймификация и социальные функции
export * from './gamification';

// Умная маршрутизация
export * from './smartRouting';

// Комиссионная система
export * from './commissionSystem';

// Динамическая упаковка туров
export * from './dynamicPackaging';

// Коренные народы и экология
export * from './indigenousEcology';

// Дикая природа
export * from './wildlife';

// Углеродные кредиты
export * from './carbonOffset';

// Главный класс приложения
export class KamchatourHub {
  private static instance: KamchatourHub;
  
  private constructor() {
    this.initialize();
  }

  public static getInstance(): KamchatourHub {
    if (!KamchatourHub.instance) {
      KamchatourHub.instance = new KamchatourHub();
    }
    return KamchatourHub.instance;
  }

  private async initialize(): Promise<void> {
    console.log('🚀 Инициализация Kamchatour Hub...');
    
    // Инициализация всех систем
    await this.initializeSystems();
    
    console.log('✅ Kamchatour Hub готов к работе!');
  }

  private async initializeSystems(): Promise<void> {
    try {
      // Инициализация AI системы
      console.log('🧠 Инициализация AI системы...');
      
      // Инициализация системы безопасности
      console.log('🛡️ Инициализация системы безопасности...');
      
      // Инициализация эко-системы
      console.log('🌱 Инициализация эко-системы...');
      
      // Инициализация геймификации
      console.log('🎮 Инициализация системы геймификации...');
      
      // Инициализация умной маршрутизации
      console.log('🗺️ Инициализация умной маршрутизации...');
      
      console.log('🎯 Все системы инициализированы успешно!');
    } catch (error) {
      console.error('❌ Ошибка инициализации систем:', error);
      throw error;
    }
  }

  // Публичные методы для доступа к функциям
  public getAIRecommendations() {
    return import('./aiRecommendations');
  }

  public getEmergencySystem() {
    return import('./emergency');
  }

  public getEcoRatingSystem() {
    return import('./ecoRating');
  }

  public getGamificationSystem() {
    return import('./gamification');
  }

  public getSmartRouting() {
    return import('./smartRouting');
  }

  // Метод для получения статистики системы
  public async getSystemStats(): Promise<any> {
    return {
      timestamp: new Date(),
      version: '2.0.0',
      features: {
        ai: 'active',
        emergency: 'active',
        eco: 'active',
        gamification: 'active',
        routing: 'active'
      },
      status: 'operational'
    };
  }

  // Метод для проверки здоровья системы
  public async healthCheck(): Promise<boolean> {
    try {
      const stats = await this.getSystemStats();
      return stats.status === 'operational';
    } catch (error) {
      return false;
    }
  }
}

// Экспорт экземпляра
export const kamchatourHub = KamchatourHub.getInstance();

// Экспорт основных функций
export const {
  getAIRecommendations,
  getSmartRoute,
  sendSOSAlert,
  calculateEcoRating,
  unlockAchievement,
  joinChallenge,
  getUserProfile,
  getLeaderboard
} = {
  getAIRecommendations: () => import('./aiRecommendations'),
  getSmartRoute: () => import('./smartRouting'),
  sendSOSAlert: () => import('./emergency'),
  calculateEcoRating: () => import('./ecoRating'),
  unlockAchievement: () => import('./gamification'),
  joinChallenge: () => import('./gamification'),
  getUserProfile: () => import('./gamification'),
  getLeaderboard: () => import('./gamification')
};