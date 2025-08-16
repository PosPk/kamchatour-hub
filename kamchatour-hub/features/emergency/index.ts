export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email: string;
  relationship: string;
  isPrimary: boolean;
  notificationPreferences: NotificationPreference[];
}

export interface NotificationPreference {
  type: 'sms' | 'email' | 'push' | 'phone';
  enabled: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface EmergencyAlert {
  id: string;
  userId: string;
  type: EmergencyType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: [number, number];
  timestamp: Date;
  status: 'active' | 'resolved' | 'false_alarm';
  description: string;
  automatic: boolean;
  responseTime?: number;
  responders: EmergencyResponder[];
}

export type EmergencyType = 
  | 'medical'
  | 'injury'
  | 'lost'
  | 'weather'
  | 'wildlife'
  | 'accident'
  | 'natural_disaster'
  | 'other';

export interface EmergencyResponder {
  id: string;
  type: 'police' | 'medical' | 'rescue' | 'local_guide' | 'mchs';
  name: string;
  phone: string;
  location: [number, number];
  estimatedArrivalTime: number;
  status: 'dispatched' | 'en_route' | 'on_scene' | 'completed';
}

export interface SafetyZone {
  id: string;
  name: string;
  center: [number, number];
  radius: number;
  type: 'safe' | 'warning' | 'danger';
  description: string;
  restrictions: string[];
  emergencyContacts: EmergencyContact[];
}

export class EmergencySystem {
  private userLocation: [number, number] | null = null;
  private emergencyContacts: EmergencyContact[] = [];
  private activeAlerts: EmergencyAlert[] = [];
  private safetyZones: SafetyZone[] = [];
  private isOffline: boolean = false;
  private satelliteConnection: boolean = false;

  constructor() {
    this.initializeEmergencySystem();
  }

  private async initializeEmergencySystem() {
    // Инициализация системы безопасности
    await this.setupSatelliteConnection();
    await this.loadEmergencyContacts();
    await this.loadSafetyZones();
    this.startLocationMonitoring();
    this.startHealthMonitoring();
  }

  async sendSOSAlert(
    type: EmergencyType,
    description: string,
    automatic: boolean = false
  ): Promise<EmergencyAlert> {
    if (!this.userLocation) {
      throw new Error('User location not available');
    }

    const alert: EmergencyAlert = {
      id: this.generateAlertId(),
      userId: 'current_user', // Заменить на реальный ID пользователя
      type,
      severity: this.calculateSeverity(type),
      location: this.userLocation,
      timestamp: new Date(),
      status: 'active',
      description,
      automatic,
      responders: []
    };

    // Отправка сигнала SOS
    await this.dispatchEmergencyResponders(alert);
    
    // Уведомление контактов
    await this.notifyEmergencyContacts(alert);
    
    // Логирование
    this.activeAlerts.push(alert);
    
    return alert;
  }

  async getNearbySafetyZones(location: [number, number], radius: number = 5000): Promise<SafetyZone[]> {
    return this.safetyZones.filter(zone => {
      const distance = this.calculateDistance(location, zone.center);
      return distance <= radius;
    });
  }

  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    return this.emergencyContacts;
  }

  async addEmergencyContact(contact: EmergencyContact): Promise<void> {
    this.emergencyContacts.push(contact);
    // Сохранение в локальное хранилище и синхронизация с сервером
  }

  async updateUserLocation(location: [number, number]): Promise<void> {
    this.userLocation = location;
    
    // Проверка нахождения в опасной зоне
    const nearbyZones = await this.getNearbySafetyZones(location, 1000);
    const dangerZones = nearbyZones.filter(zone => zone.type === 'danger');
    
    if (dangerZones.length > 0) {
      await this.sendSOSAlert('other', `User entered danger zone: ${dangerZones[0].name}`, true);
    }
  }

  async getActiveAlerts(): Promise<EmergencyAlert[]> {
    return this.activeAlerts.filter(alert => alert.status === 'active');
  }

  private async setupSatelliteConnection(): Promise<void> {
    // Настройка спутниковой связи (Starlink, Iridium и т.д.)
    try {
      // Проверка доступности спутниковой связи
      this.satelliteConnection = await this.testSatelliteConnection();
    } catch (error) {
      console.warn('Satellite connection not available, falling back to cellular');
      this.satelliteConnection = false;
    }
  }

  private async testSatelliteConnection(): Promise<boolean> {
    // Тест спутниковой связи
    return false; // Заглушка
  }

  private async loadEmergencyContacts(): Promise<void> {
    // Загрузка контактов из локального хранилища
    this.emergencyContacts = [];
  }

  private async loadSafetyZones(): Promise<void> {
    // Загрузка зон безопасности с сервера
    this.safetyZones = [];
  }

  private startLocationMonitoring(): void {
    // Мониторинг местоположения пользователя
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          const location: [number, number] = [position.coords.latitude, position.coords.longitude];
          this.updateUserLocation(location);
        },
        (error) => {
          console.error('Location monitoring error:', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 30000,
          timeout: 10000
        }
      );
    }
  }

  private startHealthMonitoring(): void {
    // Мониторинг здоровья пользователя (шаги, пульс, активность)
    // Интеграция с носимыми устройствами
  }

  private async dispatchEmergencyResponders(alert: EmergencyAlert): Promise<void> {
    // Диспетчеризация экстренных служб
    const nearbyResponders = await this.findNearbyResponders(alert.location);
    
    for (const responder of nearbyResponders) {
      responder.status = 'dispatched';
      alert.responders.push(responder);
      
      // Отправка уведомления службе
      await this.notifyResponder(responder, alert);
    }
  }

  private async findNearbyResponders(location: [number, number]): Promise<EmergencyResponder[]> {
    // Поиск ближайших служб экстренного реагирования
    return [];
  }

  private async notifyResponder(responder: EmergencyResponder, alert: EmergencyAlert): Promise<void> {
    // Уведомление службы экстренного реагирования
  }

  private async notifyEmergencyContacts(alert: EmergencyAlert): Promise<void> {
    // Уведомление экстренных контактов
    for (const contact of this.emergencyContacts) {
      if (contact.isPrimary) {
        await this.sendNotification(contact, alert);
      }
    }
  }

  private async sendNotification(contact: EmergencyContact, alert: EmergencyAlert): Promise<void> {
    // Отправка уведомления контакту
    for (const preference of contact.notificationPreferences) {
      if (preference.enabled) {
        switch (preference.type) {
          case 'sms':
            await this.sendSMS(contact.phone, this.formatAlertMessage(alert));
            break;
          case 'email':
            await this.sendEmail(contact.email, this.formatAlertMessage(alert));
            break;
          case 'push':
            await this.sendPushNotification(contact.id, this.formatAlertMessage(alert));
            break;
          case 'phone':
            await this.makePhoneCall(contact.phone);
            break;
        }
      }
    }
  }

  private formatAlertMessage(alert: EmergencyAlert): string {
    return `SOS ALERT: ${alert.type.toUpperCase()} - ${alert.description}. Location: ${alert.location.join(', ')}`;
  }

  private sendSMS(phone: string, message: string): Promise<void> {
    // Отправка SMS
    return Promise.resolve();
  }

  private sendEmail(email: string, message: string): Promise<void> {
    // Отправка email
    return Promise.resolve();
  }

  private sendPushNotification(userId: string, message: string): Promise<void> {
    // Отправка push-уведомления
    return Promise.resolve();
  }

  private makePhoneCall(phone: string): Promise<void> {
    // Звонок
    return Promise.resolve();
  }

  private calculateSeverity(type: EmergencyType): EmergencyAlert['severity'] {
    const severityMap: Record<EmergencyType, EmergencyAlert['severity']> = {
      medical: 'high',
      injury: 'high',
      lost: 'medium',
      weather: 'medium',
      wildlife: 'medium',
      accident: 'high',
      natural_disaster: 'critical',
      other: 'low'
    };
    
    return severityMap[type] || 'medium';
  }

  private calculateDistance(point1: [number, number], point2: [number, number]): number {
    // Расчет расстояния между двумя точками (формула гаверсинуса)
    const R = 6371e3; // Радиус Земли в метрах
    const φ1 = point1[0] * Math.PI / 180;
    const φ2 = point2[0] * Math.PI / 180;
    const Δφ = (point2[0] - point1[0]) * Math.PI / 180;
    const Δλ = (point2[1] - point1[1]) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Экспорт функций для использования
export const emergencySystem = new EmergencySystem();

export function sendSOSAlert(type: EmergencyType, description: string): Promise<EmergencyAlert> {
  return emergencySystem.sendSOSAlert(type, description);
}

export function getNearbySafetyZones(location: [number, number]): Promise<SafetyZone[]> {
  return emergencySystem.getNearbySafetyZones(location);
}

export function updateUserLocation(location: [number, number]): Promise<void> {
  return emergencySystem.updateUserLocation(location);
}