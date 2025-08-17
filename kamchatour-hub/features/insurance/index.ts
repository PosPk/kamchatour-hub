export interface InsurancePolicy {
  id: string;
  userId: string;
  type: InsuranceType;
  status: 'active' | 'expired' | 'cancelled' | 'claimed';
  startDate: Date;
  endDate: Date;
  coverage: CoverageDetails;
  premium: number; // стоимость страховки
  deductible: number; // франшиза
  maxCoverage: number; // максимальная выплата
  provider: InsuranceProvider;
  policyNumber: string;
  documents: InsuranceDocument[];
  claims: InsuranceClaim[];
  createdAt: Date;
  updatedAt: Date;
}

export type InsuranceType = 
  | 'medical' | 'trip_cancellation' | 'baggage' | 'liability' | 'evacuation' | 'comprehensive';

export interface CoverageDetails {
  medicalExpenses: boolean;
  emergencyEvacuation: boolean;
  tripCancellation: boolean;
  tripInterruption: boolean;
  baggageLoss: boolean;
  baggageDelay: boolean;
  flightAccident: boolean;
  personalLiability: boolean;
  naturalDisasters: boolean;
  volcanicActivity: boolean;
  earthquake: boolean;
  tsunami: boolean;
  weatherDelays: boolean;
  covid19: boolean;
  adventureSports: boolean;
  helicopterTours: boolean;
  bearWatching: boolean;
  fishing: boolean;
  hiking: boolean;
  skiing: boolean;
}

export interface InsuranceProvider {
  id: string;
  name: string;
  rating: number; // 1-5 звезд
  reliability: number; // 0-1
  responseTime: number; // в часах
  coverage: string[];
  exclusions: string[];
  contactInfo: ContactInfo;
  website: string;
  logo: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  emergency: string;
  whatsapp?: string;
  telegram?: string;
}

export interface InsuranceDocument {
  id: string;
  name: string;
  type: 'policy' | 'certificate' | 'terms' | 'claim_form';
  url: string;
  size: number; // в байтах
  uploadedAt: Date;
}

export interface InsuranceClaim {
  id: string;
  policyId: string;
  type: ClaimType;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'paid';
  description: string;
  amount: number;
  documents: ClaimDocument[];
  submittedAt: Date;
  resolvedAt?: Date;
  notes: string[];
}

export type ClaimType = 
  | 'medical' | 'trip_cancellation' | 'baggage_loss' | 'evacuation' | 'liability';

export interface ClaimDocument {
  id: string;
  name: string;
  type: 'receipt' | 'medical_report' | 'police_report' | 'photo' | 'video';
  url: string;
  uploadedAt: Date;
}

export class InsuranceSystem {
  private policies: Map<string, InsurancePolicy> = new Map();
  private providers: Map<string, InsuranceProvider> = new Map();
  private claims: Map<string, InsuranceClaim> = new Map();
  private riskAssessor: RiskAssessor;
  private claimProcessor: ClaimProcessor;
  private emergencyResponder: EmergencyResponder;

  constructor() {
    this.initializeInsuranceSystem();
  }

  private async initializeInsuranceSystem() {
    console.log('🛡️ Инициализация системы страхования...');
    
    await this.initializeRiskAssessor();
    await this.initializeClaimProcessor();
    await this.initializeEmergencyResponder();
    await this.loadInsuranceProviders();
    
    console.log('✅ Система страхования готова!');
  }

  private async initializeRiskAssessor(): Promise<void> {
    this.riskAssessor = new RiskAssessor();
    await this.riskAssessor.initialize();
  }

  private async initializeClaimProcessor(): Promise<void> {
    this.claimProcessor = new ClaimProcessor();
    await this.claimProcessor.initialize();
  }

  private async initializeEmergencyResponder(): Promise<void> {
    this.emergencyResponder = new EmergencyResponder();
    await this.emergencyResponder.initialize();
  }

  private async loadInsuranceProviders(): Promise<void> {
    // Загрузка страховых компаний, работающих на Камчатке
    const providers: InsuranceProvider[] = [
      {
        id: 'ingosstrakh',
        name: 'Ингосстрах',
        rating: 4.5,
        reliability: 0.95,
        responseTime: 2,
        coverage: ['medical', 'evacuation', 'baggage', 'liability'],
        exclusions: ['extreme_sports', 'volcanic_eruption'],
        contactInfo: {
          phone: '+7-800-100-7777',
          email: 'kamchatka@ingosstrakh.ru',
          emergency: '+7-800-100-7778'
        },
        website: 'https://ingosstrakh.ru',
        logo: 'ingosstrakh-logo.png'
      },
      {
        id: 'rosgosstrakh',
        name: 'Росгосстрах',
        rating: 4.2,
        reliability: 0.92,
        responseTime: 3,
        coverage: ['medical', 'trip_cancellation', 'baggage'],
        exclusions: ['adventure_sports', 'natural_disasters'],
        contactInfo: {
          phone: '+7-800-200-0920',
          email: 'kamchatka@rgs.ru',
          emergency: '+7-800-200-0921'
        },
        website: 'https://rgs.ru',
        logo: 'rosgosstrakh-logo.png'
      },
      {
        id: 'sogaz',
        name: 'СОГАЗ',
        rating: 4.7,
        reliability: 0.97,
        responseTime: 1.5,
        coverage: ['comprehensive', 'adventure_sports', 'volcanic_activity'],
        exclusions: ['illegal_activities'],
        contactInfo: {
          phone: '+7-800-333-0800',
          email: 'kamchatka@sogaz.ru',
          emergency: '+7-800-333-0801'
        },
        website: 'https://sogaz.ru',
        logo: 'sogaz-logo.png'
      },
      {
        id: 'kamchatka_local',
        name: 'Камчатка-Страх',
        rating: 4.8,
        reliability: 0.98,
        responseTime: 1,
        coverage: ['kamchatka_specific', 'bear_watching', 'helicopter_tours'],
        exclusions: ['international_evacuation'],
        contactInfo: {
          phone: '+7-415-200-0000',
          email: 'info@kamchatka-strah.ru',
          emergency: '+7-415-200-0001',
          whatsapp: '+7-900-000-0000',
          telegram: '@kamchatka_strah'
        },
        website: 'https://kamchatka-strah.ru',
        logo: 'kamchatka-strah-logo.png'
      }
    ];

    providers.forEach(provider => {
      this.providers.set(provider.id, provider);
    });
  }

  async getInsuranceQuote(
    userId: string,
    tripDetails: TripDetails,
    coverageOptions: CoverageOptions
  ): Promise<InsuranceQuote[]> {
    
    const quotes: InsuranceQuote[] = [];
    
    for (const provider of this.providers.values()) {
      if (this.isProviderSuitable(provider, coverageOptions)) {
        const quote = await this.calculateQuote(provider, tripDetails, coverageOptions);
        quotes.push(quote);
      }
    }
    
    // Сортировка по цене и рейтингу
    return quotes.sort((a, b) => {
      const priceScore = a.premium - b.premium;
      const ratingScore = b.provider.rating - a.provider.rating;
      return priceScore + ratingScore * 100; // рейтинг важнее цены
    });
  }

  private isProviderSuitable(
    provider: InsuranceProvider, 
    coverageOptions: CoverageOptions
  ): boolean {
    // Проверка соответствия провайдера требованиям
    for (const coverage of coverageOptions.requiredCoverage) {
      if (!provider.coverage.includes(coverage)) {
        return false;
      }
    }
    return true;
  }

  private async calculateQuote(
    provider: InsuranceProvider,
    tripDetails: TripDetails,
    coverageOptions: CoverageOptions
  ): Promise<InsuranceQuote> {
    
    // Базовая стоимость страховки
    let basePremium = this.calculateBasePremium(tripDetails);
    
    // Множители риска для Камчатки
    const riskMultipliers = await this.riskAssessor.calculateRiskMultipliers(tripDetails);
    
    // Применение множителей
    let finalPremium = basePremium;
    for (const [risk, multiplier] of Object.entries(riskMultipliers)) {
      finalPremium *= multiplier;
    }
    
    // Скидки за комплексное страхование
    if (coverageOptions.requiredCoverage.length > 5) {
      finalPremium *= 0.9; // 10% скидка
    }
    
    // Скидки за длительность
    if (tripDetails.duration > 7) {
      finalPremium *= 0.95; // 5% скидка
    }
    
    return {
      provider,
      premium: Math.round(finalPremium),
      coverage: this.buildCoverageDetails(coverageOptions),
      deductible: this.calculateDeductible(coverageOptions),
      maxCoverage: this.calculateMaxCoverage(coverageOptions),
      features: this.getProviderFeatures(provider),
      exclusions: provider.exclusions,
      responseTime: provider.responseTime,
      reliability: provider.reliability
    };
  }

  private calculateBasePremium(tripDetails: TripDetails): number {
    let basePremium = 1000; // базовая стоимость 1000₽
    
    // Влияние длительности
    basePremium += tripDetails.duration * 200;
    
    // Влияние активности
    if (tripDetails.activities.includes('helicopter_tours')) {
      basePremium += 5000;
    }
    if (tripDetails.activities.includes('bear_watching')) {
      basePremium += 3000;
    }
    if (tripDetails.activities.includes('volcano_climbing')) {
      basePremium += 4000;
    }
    
    // Влияние сезона
    if (tripDetails.season === 'winter') {
      basePremium *= 1.3; // зимой дороже
    }
    
    return basePremium;
  }

  private buildCoverageDetails(coverageOptions: CoverageOptions): CoverageDetails {
    return {
      medicalExpenses: coverageOptions.requiredCoverage.includes('medical'),
      emergencyEvacuation: coverageOptions.requiredCoverage.includes('evacuation'),
      tripCancellation: coverageOptions.requiredCoverage.includes('trip_cancellation'),
      tripInterruption: coverageOptions.requiredCoverage.includes('trip_interruption'),
      baggageLoss: coverageOptions.requiredCoverage.includes('baggage'),
      baggageDelay: coverageOptions.requiredCoverage.includes('baggage_delay'),
      flightAccident: coverageOptions.requiredCoverage.includes('flight_accident'),
      personalLiability: coverageOptions.requiredCoverage.includes('liability'),
      naturalDisasters: coverageOptions.requiredCoverage.includes('natural_disasters'),
      volcanicActivity: coverageOptions.requiredCoverage.includes('volcanic_activity'),
      earthquake: coverageOptions.requiredCoverage.includes('earthquake'),
      tsunami: coverageOptions.requiredCoverage.includes('tsunami'),
      weatherDelays: coverageOptions.requiredCoverage.includes('weather_delays'),
      covid19: coverageOptions.requiredCoverage.includes('covid19'),
      adventureSports: coverageOptions.requiredCoverage.includes('adventure_sports'),
      helicopterTours: coverageOptions.requiredCoverage.includes('helicopter_tours'),
      bearWatching: coverageOptions.requiredCoverage.includes('bear_watching'),
      fishing: coverageOptions.requiredCoverage.includes('fishing'),
      hiking: coverageOptions.requiredCoverage.includes('hiking'),
      skiing: coverageOptions.requiredCoverage.includes('skiing')
    };
  }

  private calculateDeductible(coverageOptions: CoverageOptions): number {
    let deductible = 1000; // базовая франшиза
    
    if (coverageOptions.requiredCoverage.includes('medical')) {
      deductible += 2000;
    }
    if (coverageOptions.requiredCoverage.includes('evacuation')) {
      deductible += 5000;
    }
    
    return deductible;
  }

  private calculateMaxCoverage(coverageOptions: CoverageOptions): number {
    let maxCoverage = 100000; // базовая максимальная выплата
    
    if (coverageOptions.requiredCoverage.includes('medical')) {
      maxCoverage += 500000;
    }
    if (coverageOptions.requiredCoverage.includes('evacuation')) {
      maxCoverage += 1000000;
    }
    if (coverageOptions.requiredCoverage.includes('liability')) {
      maxCoverage += 300000;
    }
    
    return maxCoverage;
  }

  private getProviderFeatures(provider: InsuranceProvider): string[] {
    const features: string[] = [];
    
    if (provider.reliability > 0.95) {
      features.push('Высокая надежность');
    }
    if (provider.responseTime < 2) {
      features.push('Быстрый ответ');
    }
    if (provider.rating > 4.5) {
      features.push('Отличные отзывы');
    }
    if (provider.contactInfo.whatsapp) {
      features.push('WhatsApp поддержка');
    }
    if (provider.contactInfo.telegram) {
      features.push('Telegram поддержка');
    }
    
    return features;
  }

  async purchaseInsurance(
    userId: string,
    providerId: string,
    quote: InsuranceQuote,
    tripDetails: TripDetails
  ): Promise<InsurancePolicy> {
    
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error('Страховой провайдер не найден');
    }
    
    const policy: InsurancePolicy = {
      id: this.generatePolicyId(),
      userId,
      type: this.determinePolicyType(quote.coverage),
      status: 'active',
      startDate: tripDetails.startDate,
      endDate: tripDetails.endDate,
      coverage: quote.coverage,
      premium: quote.premium,
      deductible: quote.deductible,
      maxCoverage: quote.maxCoverage,
      provider,
      policyNumber: this.generatePolicyNumber(provider),
      documents: [],
      claims: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Генерация страховых документов
    await this.generatePolicyDocuments(policy);
    
    this.policies.set(policy.id, policy);
    
    return policy;
  }

  private determinePolicyType(coverage: CoverageDetails): InsuranceType {
    if (coverage.medicalExpenses && coverage.emergencyEvacuation && 
        coverage.tripCancellation && coverage.baggageLoss) {
      return 'comprehensive';
    } else if (coverage.medicalExpenses && coverage.emergencyEvacuation) {
      return 'medical';
    } else if (coverage.tripCancellation) {
      return 'trip_cancellation';
    } else if (coverage.baggageLoss) {
      return 'baggage';
    } else if (coverage.personalLiability) {
      return 'liability';
    } else if (coverage.emergencyEvacuation) {
      return 'evacuation';
    }
    
    return 'comprehensive';
  }

  private async generatePolicyDocuments(policy: InsurancePolicy): Promise<void> {
    // Генерация страхового полиса
    const policyDoc: InsuranceDocument = {
      id: this.generateDocumentId(),
      name: `Страховой полис ${policy.policyNumber}`,
      type: 'policy',
      url: `/documents/policy_${policy.policyNumber}.pdf`,
      size: 102400, // 100KB
      uploadedAt: new Date()
    };
    
    // Генерация сертификата страхования
    const certificateDoc: InsuranceDocument = {
      id: this.generateDocumentId(),
      name: `Сертификат страхования ${policy.policyNumber}`,
      type: 'certificate',
      url: `/documents/certificate_${policy.policyNumber}.pdf`,
      size: 51200, // 50KB
      uploadedAt: new Date()
    };
    
    // Генерация условий страхования
    const termsDoc: InsuranceDocument = {
      id: this.generateDocumentId(),
      name: 'Условия страхования',
      type: 'terms',
      url: '/documents/insurance_terms.pdf',
      size: 204800, // 200KB
      uploadedAt: new Date()
    };
    
    policy.documents.push(policyDoc, certificateDoc, termsDoc);
  }

  async submitClaim(
    policyId: string,
    claimDetails: ClaimDetails
  ): Promise<InsuranceClaim> {
    
    const policy = this.policies.get(policyId);
    if (!policy) {
      throw new Error('Страховой полис не найден');
    }
    
    const claim: InsuranceClaim = {
      id: this.generateClaimId(),
      policyId,
      type: claimDetails.type,
      status: 'submitted',
      description: claimDetails.description,
      amount: claimDetails.amount,
      documents: [],
      submittedAt: new Date(),
      notes: []
    };
    
    // Обработка претензии
    await this.claimProcessor.processClaim(claim, policy);
    
    policy.claims.push(claim);
    this.claims.set(claim.id, claim);
    
    return claim;
  }

  async getEmergencyAssistance(
    policyId: string,
    emergencyType: EmergencyType,
    location: [number, number]
  ): Promise<EmergencyResponse> {
    
    const policy = this.policies.get(policyId);
    if (!policy) {
      throw new Error('Страховой полис не найден');
    }
    
    if (policy.status !== 'active') {
      throw new Error('Страховой полис не активен');
    }
    
    return await this.emergencyResponder.respondToEmergency(
      emergencyType,
      location,
      policy
    );
  }

  async getPolicies(userId: string): Promise<InsurancePolicy[]> {
    return Array.from(this.policies.values())
      .filter(policy => policy.userId === userId);
  }

  async getPolicy(policyId: string): Promise<InsurancePolicy | null> {
    return this.policies.get(policyId) || null;
  }

  async getProviders(): Promise<InsuranceProvider[]> {
    return Array.from(this.providers.values());
  }

  private generatePolicyId(): string {
    return `policy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generatePolicyNumber(provider: InsuranceProvider): string {
    return `${provider.id.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }

  private generateDocumentId(): string {
    return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateClaimId(): string {
    return `claim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Вспомогательные классы
class RiskAssessor {
  async initialize(): Promise<void> {
    console.log('Инициализация оценщика рисков...');
  }

  async calculateRiskMultipliers(tripDetails: TripDetails): Promise<Record<string, number>> {
    const multipliers: Record<string, number> = {
      kamchatka_region: 1.5, // Камчатка - повышенный риск
      volcanic_activity: 1.3, // вулканическая активность
      bear_encounter: 1.4, // встреча с медведями
      helicopter_tours: 1.6, // вертолетные туры
      winter_season: 1.2, // зимний сезон
      adventure_sports: 1.3, // экстремальные виды спорта
      remote_locations: 1.4, // удаленные локации
      natural_disasters: 1.5 // стихийные бедствия
    };
    
    return multipliers;
  }
}

class ClaimProcessor {
  async initialize(): Promise<void> {
    console.log('Инициализация обработчика претензий...');
  }

  async processClaim(claim: InsuranceClaim, policy: InsurancePolicy): Promise<void> {
    // Логика обработки страховой претензии
    console.log(`Обработка претензии ${claim.id} для полиса ${policy.policyNumber}`);
  }
}

class EmergencyResponder {
  async initialize(): Promise<void> {
    console.log('Инициализация экстренного реагирования...');
  }

  async respondToEmergency(
    emergencyType: EmergencyType,
    location: [number, number],
    policy: InsurancePolicy
  ): Promise<EmergencyResponse> {
    // Логика экстренного реагирования
    return {
      responseId: `emergency_${Date.now()}`,
      status: 'responding',
      estimatedTime: 30, // минуты
      team: 'emergency_response_team',
      contact: policy.provider.contactInfo.emergency
    };
  }
}

// Интерфейсы
export interface TripDetails {
  startDate: Date;
  endDate: Date;
  duration: number; // дни
  destination: string;
  activities: string[];
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  participants: number;
  accommodation: string;
  transportation: string[];
}

export interface CoverageOptions {
  requiredCoverage: string[];
  optionalCoverage: string[];
  maxDeductible: number;
  minCoverage: number;
}

export interface InsuranceQuote {
  provider: InsuranceProvider;
  premium: number;
  coverage: CoverageDetails;
  deductible: number;
  maxCoverage: number;
  features: string[];
  exclusions: string[];
  responseTime: number;
  reliability: number;
}

export interface ClaimDetails {
  type: ClaimType;
  description: string;
  amount: number;
  documents?: ClaimDocument[];
}

export type EmergencyType = 
  | 'medical' | 'evacuation' | 'natural_disaster' | 'accident' | 'security';

export interface EmergencyResponse {
  responseId: string;
  status: 'responding' | 'on_way' | 'arrived' | 'resolved';
  estimatedTime: number; // минуты
  team: string;
  contact: string;
}

// Экспорт системы
export const insuranceSystem = new InsuranceSystem();

export function getInsuranceQuote(
  userId: string,
  tripDetails: TripDetails,
  coverageOptions: CoverageOptions
): Promise<InsuranceQuote[]> {
  return insuranceSystem.getInsuranceQuote(userId, tripDetails, coverageOptions);
}

export function purchaseInsurance(
  userId: string,
  providerId: string,
  quote: InsuranceQuote,
  tripDetails: TripDetails
): Promise<InsurancePolicy> {
  return insuranceSystem.purchaseInsurance(userId, providerId, quote, tripDetails);
}

export function submitClaim(
  policyId: string,
  claimDetails: ClaimDetails
): Promise<InsuranceClaim> {
  return insuranceSystem.submitClaim(policyId, claimDetails);
}

export function getEmergencyAssistance(
  policyId: string,
  emergencyType: EmergencyType,
  location: [number, number]
): Promise<EmergencyResponse> {
  return insuranceSystem.getEmergencyAssistance(policyId, emergencyType, location);
}