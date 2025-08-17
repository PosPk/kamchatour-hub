export interface ARExperience {
  id: string;
  name: string;
  description: string;
  type: 'volcano' | 'wildlife' | 'culture' | 'adventure' | 'education';
  location: [number, number];
  arContent: ARContent;
  vrContent: VRContent;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // в минутах
  rating: number; // 0-5
  tags: string[];
}

export interface ARContent {
  models: ARModel[];
  animations: ARAnimation[];
  interactions: ARInteraction[];
  audio: ARAudio;
  visualEffects: ARVisualEffect[];
}

export interface ARModel {
  id: string;
  name: string;
  type: '3d_model' | 'hologram' | 'particle_system';
  url: string;
  scale: [number, number, number];
  position: [number, number, number];
  rotation: [number, number, number];
  animations: string[];
}

export interface ARAnimation {
  id: string;
  name: string;
  type: 'rotation' | 'scaling' | 'translation' | 'custom';
  duration: number;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  parameters: any;
}

export interface ARInteraction {
  id: string;
  type: 'tap' | 'swipe' | 'pinch' | 'voice' | 'gesture';
  trigger: string;
  action: string;
  feedback: string;
}

export interface ARAudio {
  ambient: string;
  narration: string;
  effects: string[];
  volume: number;
  spatial: boolean;
}

export interface ARVisualEffect {
  id: string;
  type: 'particles' | 'lighting' | 'weather' | 'atmosphere';
  intensity: number;
  color: string;
  duration: number;
}

export interface VRContent {
  scenes: VRScene[];
  navigation: VRNavigation;
  interactions: VRInteraction[];
  audio: VRAudio;
  haptics: VRHaptics;
}

export interface VRScene {
  id: string;
  name: string;
  environment: VREnvironment;
  objects: VRObject[];
  lighting: VRLighting;
  skybox: string;
}

export interface VREnvironment {
  type: 'volcano' | 'forest' | 'ocean' | 'mountain' | 'village';
  weather: VRWeather;
  timeOfDay: 'dawn' | 'day' | 'dusk' | 'night';
  season: 'spring' | 'summer' | 'autumn' | 'winter';
}

export interface VRWeather {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'foggy';
  temperature: number;
  windSpeed: number;
  visibility: number;
}

export interface VRObject {
  id: string;
  name: string;
  type: 'static' | 'animated' | 'interactive';
  model: string;
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
  physics: VRPhysics;
}

export interface VRPhysics {
  mass: number;
  friction: number;
  restitution: number;
  collider: 'box' | 'sphere' | 'capsule' | 'mesh';
}

export interface VRLighting {
  ambient: VRLight;
  directional: VRLight;
  point: VRLight[];
  spot: VRLight[];
}

export interface VRLight {
  color: string;
  intensity: number;
  range: number;
  position: [number, number, number];
  direction: [number, number, number];
}

export interface VRNavigation {
  type: 'teleport' | 'walk' | 'fly' | 'vehicle';
  waypoints: VRWaypoint[];
  restrictions: VRNavigationRestriction[];
}

export interface VRWaypoint {
  id: string;
  position: [number, number, number];
  name: string;
  description: string;
  isAccessible: boolean;
}

export interface VRNavigationRestriction {
  type: 'area' | 'height' | 'slope' | 'custom';
  parameters: any;
}

export interface VRInteraction {
  id: string;
  type: 'grab' | 'throw' | 'push' | 'pull' | 'custom';
  trigger: string;
  feedback: string;
  hapticIntensity: number;
}

export interface VRAudio {
  ambient: string;
  spatial: boolean;
  volume: number;
  reverb: number;
  occlusion: boolean;
}

export interface VRHaptics {
  enabled: boolean;
  intensity: number;
  pattern: string;
  duration: number;
}

export class ARVRSystem {
  private arExperiences: Map<string, ARExperience> = new Map();
  private vrExperiences: Map<string, VRContent> = new Map();
  private activeSessions: Map<string, ARVRSession> = new Map();
  private deviceCapabilities: DeviceCapabilities;

  constructor() {
    this.initializeARVRSystem();
  }

  private async initializeARVRSystem() {
    console.log('🚀 Инициализация AR/VR системы...');
    
    await this.detectDeviceCapabilities();
    await this.loadARExperiences();
    await this.loadVRExperiences();
    
    console.log('✅ AR/VR система готова!');
  }

  private async detectDeviceCapabilities(): Promise<void> {
    // Определение возможностей устройства
    this.deviceCapabilities = {
      ar: this.checkARSupport(),
      vr: this.checkVRSupport(),
      performance: await this.measurePerformance(),
      sensors: this.checkSensorSupport()
    };
  }

  private checkARSupport(): boolean {
    // Проверка поддержки AR
    return 'xr' in navigator && 'isSessionSupported' in navigator.xr;
  }

  private checkVRSupport(): boolean {
    // Проверка поддержки VR
    return 'getVRDisplays' in navigator || 'getVRDisplays' in navigator;
  }

  private async measurePerformance(): Promise<PerformanceMetrics> {
    // Измерение производительности устройства
    const start = performance.now();
    
    // Простой тест производительности
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
      sum += Math.random();
    }
    
    const end = performance.now();
    const duration = end - start;
    
    return {
      cpu: duration < 100 ? 'high' : duration < 500 ? 'medium' : 'low',
      memory: 'medium', // Упрощенная оценка
      gpu: 'medium' // Упрощенная оценка
    };
  }

  private checkSensorSupport(): SensorSupport {
    return {
      accelerometer: 'Accelerometer' in window,
      gyroscope: 'Gyroscope' in window,
      magnetometer: 'Magnetometer' in window,
      geolocation: 'geolocation' in navigator
    };
  }

  async startARExperience(
    experienceId: string, 
    userId: string
  ): Promise<ARVRSession> {
    const experience = this.arExperiences.get(experienceId);
    if (!experience) {
      throw new Error('AR опыт не найден');
    }

    if (!this.deviceCapabilities.ar) {
      throw new Error('AR не поддерживается на этом устройстве');
    }

    const session: ARVRSession = {
      id: this.generateSessionId(),
      userId,
      experienceId,
      type: 'ar',
      startTime: new Date(),
      status: 'active',
      data: {}
    };

    // Инициализация AR сессии
    await this.initializeARSession(session, experience);
    
    this.activeSessions.set(session.id, session);
    
    return session;
  }

  async startVRExperience(
    experienceId: string, 
    userId: string
  ): Promise<ARVRSession> {
    const experience = this.vrExperiences.get(experienceId);
    if (!experience) {
      throw new Error('VR опыт не найден');
    }

    if (!this.deviceCapabilities.vr) {
      throw new Error('VR не поддерживается на этом устройстве');
    }

    const session: ARVRSession = {
      id: this.generateSessionId(),
      userId,
      experienceId,
      type: 'vr',
      startTime: new Date(),
      status: 'active',
      data: {}
    };

    // Инициализация VR сессии
    await this.initializeVRSession(session, experience);
    
    this.activeSessions.set(session.id, session);
    
    return session;
  }

  private async initializeARSession(session: ARVRSession, experience: ARExperience): Promise<void> {
    // Инициализация AR сессии с WebXR
    try {
      const xrSession = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['local', 'local-floor'],
        optionalFeatures: ['dom-overlay', 'hit-test']
      });

      session.data.xrSession = xrSession;
      
      // Настройка AR контента
      await this.setupARContent(session, experience);
      
      // Запуск рендеринга
      this.startARRendering(session);
      
    } catch (error) {
      console.error('Ошибка инициализации AR:', error);
      throw error;
    }
  }

  private async initializeVRSession(session: ARVRSession, experience: VRContent): Promise<void> {
    // Инициализация VR сессии
    try {
      // Создание 3D сцены
      const scene = await this.createVRScene(experience);
      session.data.scene = scene;
      
      // Настройка VR контроллеров
      await this.setupVRControllers(session);
      
      // Запуск VR рендеринга
      this.startVRRendering(session);
      
    } catch (error) {
      console.error('Ошибка инициализации VR:', error);
      throw error;
    }
  }

  private async setupARContent(session: ARVRSession, experience: ARExperience): Promise<void> {
    // Загрузка 3D моделей
    for (const model of experience.arContent.models) {
      await this.loadARModel(model);
    }
    
    // Настройка анимаций
    for (const animation of experience.arContent.animations) {
      this.setupARAnimation(animation);
    }
    
    // Настройка взаимодействий
    for (const interaction of experience.arContent.interactions) {
      this.setupARInteraction(interaction);
    }
    
    // Настройка аудио
    await this.setupARAudio(experience.arContent.audio);
    
    // Настройка визуальных эффектов
    for (const effect of experience.arContent.visualEffects) {
      this.setupARVisualEffect(effect);
    }
  }

  private async createVRScene(experience: VRContent): Promise<any> {
    // Создание 3D сцены для VR
    const scene = {
      environment: experience.environment,
      objects: experience.objects,
      lighting: experience.lighting,
      skybox: experience.scenes[0]?.skybox
    };
    
    return scene;
  }

  private async loadARModel(model: ARModel): Promise<void> {
    // Загрузка 3D модели для AR
    console.log(`Загрузка AR модели: ${model.name}`);
    
    // Здесь должна быть реальная загрузка модели
    // Например, через Three.js или Babylon.js
  }

  private setupARAnimation(animation: ARAnimation): void {
    // Настройка анимации для AR
    console.log(`Настройка AR анимации: ${animation.name}`);
  }

  private setupARInteraction(interaction: ARInteraction): void {
    // Настройка взаимодействия для AR
    console.log(`Настройка AR взаимодействия: ${interaction.type}`);
  }

  private async setupARAudio(audio: ARAudio): Promise<void> {
    // Настройка аудио для AR
    console.log(`Настройка AR аудио: ${audio.ambient}`);
  }

  private setupARVisualEffect(effect: ARVisualEffect): void {
    // Настройка визуального эффекта для AR
    console.log(`Настройка AR эффекта: ${effect.type}`);
  }

  private async setupVRControllers(session: ARVRSession): Promise<void> {
    // Настройка VR контроллеров
    console.log('Настройка VR контроллеров');
  }

  private startARRendering(session: ARVRSession): void {
    // Запуск AR рендеринга
    console.log('Запуск AR рендеринга');
    
    // Здесь должен быть основной цикл рендеринга AR
    const renderLoop = () => {
      if (session.status === 'active') {
        this.renderARFrame(session);
        requestAnimationFrame(renderLoop);
      }
    };
    
    renderLoop();
  }

  private startVRRendering(session: ARVRSession): void {
    // Запуск VR рендеринга
    console.log('Запуск VR рендеринга');
    
    // Здесь должен быть основной цикл рендеринга VR
    const renderLoop = () => {
      if (session.status === 'active') {
        this.renderVRFrame(session);
        requestAnimationFrame(renderLoop);
      }
    };
    
    renderLoop();
  }

  private renderARFrame(session: ARVRSession): void {
    // Рендеринг одного кадра AR
    // Здесь должна быть реальная логика рендеринга
  }

  private renderVRFrame(session: ARVRSession): void {
    // Рендеринг одного кадра VR
    // Здесь должна быть реальная логика рендеринга
  }

  async stopSession(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Сессия не найдена');
    }

    session.status = 'stopped';
    session.endTime = new Date();

    // Очистка ресурсов
    if (session.type === 'ar' && session.data.xrSession) {
      await session.data.xrSession.end();
    }

    // Сохранение статистики
    await this.saveSessionStats(session);

    this.activeSessions.delete(sessionId);
  }

  private async saveSessionStats(session: ARVRSession): Promise<void> {
    // Сохранение статистики сессии
    const duration = session.endTime!.getTime() - session.startTime.getTime();
    
    console.log(`Сессия ${session.id} завершена. Длительность: ${duration}ms`);
  }

  async getARExperiences(location?: [number, number]): Promise<ARExperience[]> {
    let experiences = Array.from(this.arExperiences.values());
    
    if (location) {
      // Фильтрация по местоположению
      experiences = experiences.filter(exp => 
        this.isNearLocation(exp.location, location, 10000) // 10 км
      );
    }
    
    return experiences.sort((a, b) => b.rating - a.rating);
  }

  async getVRExperiences(): Promise<VRContent[]> {
    return Array.from(this.vrExperiences.values());
  }

  async getActiveSessions(userId: string): Promise<ARVRSession[]> {
    return Array.from(this.activeSessions.values())
      .filter(session => session.userId === userId && session.status === 'active');
  }

  private isNearLocation(
    location1: [number, number], 
    location2: [number, number], 
    maxDistance: number
  ): boolean {
    const distance = this.calculateDistance(location1, location2);
    return distance <= maxDistance;
  }

  private calculateDistance(
    point1: [number, number], 
    point2: [number, number]
  ): number {
    // Формула гаверсинуса для расчета расстояния
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

  private generateSessionId(): string {
    return `arvr_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async loadARExperiences(): Promise<void> {
    // Загрузка AR опытов
    const defaultExperiences: ARExperience[] = [
      {
        id: 'volcano_exploration',
        name: 'Исследование вулкана',
        description: 'Погрузитесь в мир вулканов Камчатки',
        type: 'volcano',
        location: [56.3247, 158.6977], // Координаты вулкана Ключевская Сопка
        arContent: {
          models: [],
          animations: [],
          interactions: [],
          audio: { ambient: '', narration: '', effects: [], volume: 0.8, spatial: true },
          visualEffects: []
        },
        vrContent: {
          scenes: [],
          navigation: { type: 'teleport', waypoints: [], restrictions: [] },
          interactions: [],
          audio: { ambient: '', spatial: true, volume: 0.8, reverb: 0.5, occlusion: true },
          haptics: { enabled: true, intensity: 0.7, pattern: 'pulse', duration: 100 }
        },
        difficulty: 'intermediate',
        duration: 15,
        rating: 4.8,
        tags: ['вулкан', 'природа', 'образование']
      }
    ];

    for (const experience of defaultExperiences) {
      this.arExperiences.set(experience.id, experience);
    }
  }

  private async loadVRExperiences(): Promise<void> {
    // Загрузка VR опытов
    // Здесь будут загружаться VR сцены
  }
}

// Интерфейсы для системы
export interface ARVRSession {
  id: string;
  userId: string;
  experienceId: string;
  type: 'ar' | 'vr';
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'paused' | 'stopped';
  data: any;
}

export interface DeviceCapabilities {
  ar: boolean;
  vr: boolean;
  performance: PerformanceMetrics;
  sensors: SensorSupport;
}

export interface PerformanceMetrics {
  cpu: 'low' | 'medium' | 'high';
  memory: 'low' | 'medium' | 'high';
  gpu: 'low' | 'medium' | 'high';
}

export interface SensorSupport {
  accelerometer: boolean;
  gyroscope: boolean;
  magnetometer: boolean;
  geolocation: boolean;
}

// Экспорт системы
export const arvrSystem = new ARVRSystem();

export function startARExperience(experienceId: string, userId: string): Promise<ARVRSession> {
  return arvrSystem.startARExperience(experienceId, userId);
}

export function startVRExperience(experienceId: string, userId: string): Promise<ARVRSession> {
  return arvrSystem.startVRExperience(experienceId, userId);
}

export function getARExperiences(location?: [number, number]): Promise<ARExperience[]> {
  return arvrSystem.getARExperiences(location);
}

export function getVRExperiences(): Promise<VRContent[]> {
  return arvrSystem.getVRExperiences();
}