export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  progress: number; // 0-100
  maxProgress: number;
  requirements: AchievementRequirement[];
}

export type AchievementCategory = 
  | 'exploration'
  | 'sustainability'
  | 'community'
  | 'safety'
  | 'culture'
  | 'adventure'
  | 'photography'
  | 'conservation';

export interface AchievementRequirement {
  type: 'distance' | 'visits' | 'photos' | 'eco_actions' | 'community_help' | 'safety_checks';
  value: number;
  current: number;
  description: string;
}

export interface UserProfile {
  id: string;
  username: string;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  achievements: Achievement[];
  totalPoints: number;
  rank: UserRank;
  badges: Badge[];
  stats: UserStats;
  friends: string[];
  followers: string[];
  following: string[];
}

export interface UserRank {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  position: number;
  totalUsers: number;
  season: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  category: BadgeCategory;
}

export type BadgeCategory = 
  | 'first_time'
  | 'milestone'
  | 'special_event'
  | 'seasonal'
  | 'challenge';

export interface UserStats {
  totalDistance: number; // в км
  totalVisits: number;
  totalPhotos: number;
  ecoActionsCompleted: number;
  communityHelpProvided: number;
  safetyChecksPerformed: number;
  carbonFootprintOffset: number; // в кг CO2
  timeSpentOutdoors: number; // в часах
  routesCompleted: number;
  challengesWon: number;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: ChallengeType;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  rewards: ChallengeReward[];
  startDate: Date;
  endDate: Date;
  participants: ChallengeParticipant[];
  maxParticipants: number;
  requirements: ChallengeRequirement[];
  leaderboard: ChallengeLeaderboardEntry[];
}

export type ChallengeType = 
  | 'photo_contest'
  | 'eco_challenge'
  | 'safety_awareness'
  | 'cultural_exploration'
  | 'adventure_quest'
  | 'community_service';

export interface ChallengeReward {
  type: 'points' | 'badge' | 'achievement' | 'real_world';
  value: any;
  description: string;
}

export interface ChallengeParticipant {
  userId: string;
  username: string;
  joinedAt: Date;
  progress: number;
  score: number;
  submissions: ChallengeSubmission[];
}

export interface ChallengeSubmission {
  id: string;
  type: 'photo' | 'video' | 'text' | 'data';
  content: any;
  timestamp: Date;
  score: number;
  verified: boolean;
}

export interface ChallengeRequirement {
  type: 'location' | 'action' | 'time' | 'social';
  value: any;
  description: string;
}

export interface ChallengeLeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  position: number;
  lastUpdated: Date;
}

export interface SocialFeed {
  id: string;
  userId: string;
  username: string;
  type: 'achievement' | 'challenge' | 'route' | 'photo' | 'eco_action';
  content: any;
  timestamp: Date;
  likes: number;
  comments: Comment[];
  shares: number;
  location?: [number, number];
  tags: string[];
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: Date;
  likes: number;
  replies: Comment[];
}

export class GamificationSystem {
  private achievements: Map<string, Achievement> = new Map();
  private challenges: Map<string, Challenge> = new Map();
  private userProfiles: Map<string, UserProfile> = new Map();
  private socialFeed: SocialFeed[] = [];

  constructor() {
    this.initializeGamificationSystem();
  }

  private async initializeGamificationSystem() {
    await this.loadAchievements();
    await this.loadChallenges();
    this.startSeasonalEvents();
    this.startDailyChallenges();
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<Achievement | null> {
    const achievement = this.achievements.get(achievementId);
    const userProfile = this.userProfiles.get(userId);
    
    if (!achievement || !userProfile) {
      return null;
    }

    // Проверка, не разблокировано ли уже достижение
    const existingAchievement = userProfile.achievements.find(a => a.id === achievementId);
    if (existingAchievement && existingAchievement.unlockedAt) {
      return existingAchievement;
    }

    // Проверка выполнения требований
    if (!this.checkAchievementRequirements(achievement, userProfile)) {
      return null;
    }

    // Разблокировка достижения
    const unlockedAchievement: Achievement = {
      ...achievement,
      unlockedAt: new Date(),
      progress: achievement.maxProgress
    };

    // Обновление профиля пользователя
    userProfile.achievements.push(unlockedAchievement);
    userProfile.totalPoints += achievement.points;
    userProfile.experience += achievement.points * 10;

    // Проверка повышения уровня
    await this.checkLevelUp(userProfile);

    // Добавление в социальную ленту
    await this.addToSocialFeed(userId, 'achievement', unlockedAchievement);

    return unlockedAchievement;
  }

  async createChallenge(challengeData: Partial<Challenge>): Promise<Challenge> {
    const challenge: Challenge = {
      id: this.generateChallengeId(),
      name: challengeData.name || 'New Challenge',
      description: challengeData.description || '',
      type: challengeData.type || 'eco_challenge',
      difficulty: challengeData.difficulty || 'medium',
      rewards: challengeData.rewards || [],
      startDate: challengeData.startDate || new Date(),
      endDate: challengeData.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней по умолчанию
      participants: [],
      maxParticipants: challengeData.maxParticipants || 100,
      requirements: challengeData.requirements || [],
      leaderboard: []
    };

    this.challenges.set(challenge.id, challenge);
    return challenge;
  }

  async joinChallenge(userId: string, challengeId: string): Promise<boolean> {
    const challenge = this.challenges.get(challengeId);
    const userProfile = this.userProfiles.get(userId);
    
    if (!challenge || !userProfile) {
      return false;
    }

    // Проверка ограничений
    if (challenge.participants.length >= challenge.maxParticipants) {
      return false;
    }

    // Проверка, не участвует ли уже пользователь
    const existingParticipant = challenge.participants.find(p => p.userId === userId);
    if (existingParticipant) {
      return false;
    }

    // Добавление участника
    const participant: ChallengeParticipant = {
      userId,
      username: userProfile.username,
      joinedAt: new Date(),
      progress: 0,
      score: 0,
      submissions: []
    };

    challenge.participants.push(participant);
    
    // Добавление в социальную ленту
    await this.addToSocialFeed(userId, 'challenge', challenge);

    return true;
  }

  async submitChallengeEntry(
    userId: string, 
    challengeId: string, 
    submission: Omit<ChallengeSubmission, 'id' | 'timestamp' | 'score' | 'verified'>
  ): Promise<ChallengeSubmission | null> {
    const challenge = this.challenges.get(challengeId);
    const userProfile = this.userProfiles.get(userId);
    
    if (!challenge || !userProfile) {
      return null;
    }

    const participant = challenge.participants.find(p => p.userId === userId);
    if (!participant) {
      return null;
    }

    // Создание заявки
    const challengeSubmission: ChallengeSubmission = {
      id: this.generateSubmissionId(),
      type: submission.type,
      content: submission.content,
      timestamp: new Date(),
      score: 0,
      verified: false
    };

    // Оценка заявки
    challengeSubmission.score = await this.evaluateSubmission(challengeSubmission, challenge);
    challengeSubmission.verified = true;

    // Обновление прогресса участника
    participant.submissions.push(challengeSubmission);
    participant.score += challengeSubmission.score;
    participant.progress = Math.min(100, (participant.score / this.getMaxChallengeScore(challenge)) * 100);

    // Обновление лидерборда
    this.updateChallengeLeaderboard(challenge);

    // Проверка завершения челленджа
    if (participant.progress >= 100) {
      await this.completeChallenge(userId, challengeId);
    }

    return challengeSubmission;
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return this.userProfiles.get(userId) || null;
  }

  async getLeaderboard(category: 'global' | 'friends' | 'seasonal', limit: number = 50): Promise<UserProfile[]> {
    const allProfiles = Array.from(this.userProfiles.values());
    
    switch (category) {
      case 'global':
        return allProfiles
          .sort((a, b) => b.totalPoints - a.totalPoints)
          .slice(0, limit);
      
      case 'friends':
        // Логика для друзей
        return allProfiles.slice(0, limit);
      
      case 'seasonal':
        // Логика для сезонного рейтинга
        return allProfiles.slice(0, limit);
      
      default:
        return allProfiles.slice(0, limit);
    }
  }

  async getSocialFeed(userId: string, limit: number = 20): Promise<SocialFeed[]> {
    const userProfile = this.userProfiles.get(userId);
    if (!userProfile) {
      return [];
    }

    // Получение ленты друзей и подписок
    const relevantFeeds = this.socialFeed.filter(feed => 
      userProfile.friends.includes(feed.userId) || 
      userProfile.following.includes(feed.userId) ||
      feed.userId === userId
    );

    return relevantFeeds
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async addFriend(userId: string, friendId: string): Promise<boolean> {
    const userProfile = this.userProfiles.get(userId);
    const friendProfile = this.userProfiles.get(friendId);
    
    if (!userProfile || !friendProfile) {
      return false;
    }

    // Проверка, не добавлен ли уже друг
    if (userProfile.friends.includes(friendId)) {
      return false;
    }

    // Добавление друга
    userProfile.friends.push(friendId);
    friendProfile.followers.push(userId);

    return true;
  }

  async followUser(userId: string, targetUserId: string): Promise<boolean> {
    const userProfile = this.userProfiles.get(userId);
    const targetProfile = this.userProfiles.get(targetUserId);
    
    if (!userProfile || !targetProfile || userId === targetUserId) {
      return false;
    }

    // Проверка, не подписан ли уже
    if (userProfile.following.includes(targetUserId)) {
      return false;
    }

    // Подписка
    userProfile.following.push(targetUserId);
    targetProfile.followers.push(userId);

    return true;
  }

  private async checkLevelUp(userProfile: UserProfile): Promise<void> {
    const currentLevel = userProfile.level;
    const newLevel = Math.floor(userProfile.experience / 1000) + 1;
    
    if (newLevel > currentLevel) {
      userProfile.level = newLevel;
      userProfile.experienceToNextLevel = newLevel * 1000;
      
      // Награда за повышение уровня
      const levelUpReward = this.calculateLevelUpReward(newLevel);
      userProfile.totalPoints += levelUpReward;
      
      // Добавление в социальную ленту
      await this.addToSocialFeed(userProfile.id, 'achievement', { 
        name: `Level ${newLevel}`, 
        description: `Достигнут уровень ${newLevel}!` 
      });
    }
  }

  private calculateLevelUpReward(level: number): number {
    return level * 50; // Базовое вознаграждение за уровень
  }

  private checkAchievementRequirements(achievement: Achievement, userProfile: UserProfile): boolean {
    for (const requirement of achievement.requirements) {
      const currentValue = this.getRequirementValue(requirement.type, userProfile);
      if (currentValue < requirement.value) {
        return false;
      }
    }
    return true;
  }

  private getRequirementValue(type: string, userProfile: UserProfile): number {
    switch (type) {
      case 'distance':
        return userProfile.stats.totalDistance;
      case 'visits':
        return userProfile.stats.totalVisits;
      case 'photos':
        return userProfile.stats.totalPhotos;
      case 'eco_actions':
        return userProfile.stats.ecoActionsCompleted;
      case 'community_help':
        return userProfile.stats.communityHelpProvided;
      case 'safety_checks':
        return userProfile.stats.safetyChecksPerformed;
      default:
        return 0;
    }
  }

  private async evaluateSubmission(submission: ChallengeSubmission, challenge: Challenge): Promise<number> {
    // Система оценки заявок на челлендж
    let score = 0;
    
    switch (submission.type) {
      case 'photo':
        score = this.evaluatePhotoSubmission(submission.content);
        break;
      case 'video':
        score = this.evaluateVideoSubmission(submission.content);
        break;
      case 'text':
        score = this.evaluateTextSubmission(submission.content);
        break;
      case 'data':
        score = this.evaluateDataSubmission(submission.content);
        break;
    }
    
    return Math.min(100, score);
  }

  private evaluatePhotoSubmission(content: any): number {
    // Оценка фотографий (качество, композиция, соответствие теме)
    return Math.floor(Math.random() * 100) + 50; // Заглушка
  }

  private evaluateVideoSubmission(content: any): number {
    // Оценка видео
    return Math.floor(Math.random() * 100) + 50; // Заглушка
  }

  private evaluateTextSubmission(content: any): number {
    // Оценка текста
    return Math.floor(Math.random() * 100) + 50; // Заглушка
  }

  private evaluateDataSubmission(content: any): number {
    // Оценка данных
    return Math.floor(Math.random() * 100) + 50; // Заглушка
  }

  private getMaxChallengeScore(challenge: Challenge): number {
    // Максимальный возможный балл за челлендж
    return challenge.requirements.length * 100;
  }

  private updateChallengeLeaderboard(challenge: Challenge): void {
    // Обновление лидерборда челленджа
    challenge.leaderboard = challenge.participants
      .map(participant => ({
        userId: participant.userId,
        username: participant.username,
        score: participant.score,
        position: 0,
        lastUpdated: new Date()
      }))
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({ ...entry, position: index + 1 }));
  }

  private async completeChallenge(userId: string, challengeId: string): Promise<void> {
    const challenge = this.challenges.get(challengeId);
    const userProfile = this.userProfiles.get(userId);
    
    if (!challenge || !userProfile) {
      return;
    }

    // Выдача наград
    for (const reward of challenge.rewards) {
      await this.grantReward(userId, reward);
    }

    // Добавление в социальную ленту
    await this.addToSocialFeed(userId, 'challenge', { 
      name: challenge.name, 
      description: 'Челлендж завершен!' 
    });
  }

  private async grantReward(userId: string, reward: ChallengeReward): Promise<void> {
    const userProfile = this.userProfiles.get(userId);
    if (!userProfile) return;

    switch (reward.type) {
      case 'points':
        userProfile.totalPoints += reward.value;
        userProfile.experience += reward.value * 10;
        break;
      case 'badge':
        // Добавление значка
        break;
      case 'achievement':
        // Разблокировка достижения
        break;
      case 'real_world':
        // Реальные награды
        break;
    }
  }

  private async addToSocialFeed(
    userId: string, 
    type: SocialFeed['type'], 
    content: any
  ): Promise<void> {
    const userProfile = this.userProfiles.get(userId);
    if (!userProfile) return;

    const feed: SocialFeed = {
      id: this.generateFeedId(),
      userId,
      username: userProfile.username,
      type,
      content,
      timestamp: new Date(),
      likes: 0,
      comments: [],
      shares: 0,
      tags: []
    };

    this.socialFeed.unshift(feed);
  }

  private startSeasonalEvents(): void {
    // Запуск сезонных событий
    setInterval(() => {
      this.checkSeasonalEvents();
    }, 24 * 60 * 60 * 1000); // Каждый день
  }

  private startDailyChallenges(): void {
    // Запуск ежедневных челленджей
    setInterval(() => {
      this.createDailyChallenge();
    }, 24 * 60 * 60 * 1000); // Каждый день
  }

  private async checkSeasonalEvents(): Promise<void> {
    // Проверка сезонных событий
  }

  private async createDailyChallenge(): Promise<void> {
    // Создание ежедневного челленджа
  }

  private async loadAchievements(): Promise<void> {
    // Загрузка достижений
    const defaultAchievements: Achievement[] = [
      {
        id: 'first_visit',
        name: 'Первый визит',
        description: 'Посетите Камчатку впервые',
        icon: '🌋',
        category: 'exploration',
        points: 100,
        rarity: 'common',
        progress: 0,
        maxProgress: 1,
        requirements: [
          {
            type: 'visits',
            value: 1,
            current: 0,
            description: 'Посетить Камчатку'
          }
        ]
      },
      {
        id: 'eco_warrior',
        name: 'Эко-воин',
        description: 'Выполните 10 экологических действий',
        icon: '🌱',
        category: 'sustainability',
        points: 500,
        rarity: 'rare',
        progress: 0,
        maxProgress: 10,
        requirements: [
          {
            type: 'eco_actions',
            value: 10,
            current: 0,
            description: 'Выполнить 10 экологических действий'
          }
        ]
      }
    ];

    for (const achievement of defaultAchievements) {
      this.achievements.set(achievement.id, achievement);
    }
  }

  private async loadChallenges(): Promise<void> {
    // Загрузка челленджей
  }

  private generateChallengeId(): string {
    return `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSubmissionId(): string {
    return `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateFeedId(): string {
    return `feed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Экспорт системы
export const gamificationSystem = new GamificationSystem();

export function unlockAchievement(userId: string, achievementId: string): Promise<Achievement | null> {
  return gamificationSystem.unlockAchievement(userId, achievementId);
}

export function joinChallenge(userId: string, challengeId: string): Promise<boolean> {
  return gamificationSystem.joinChallenge(userId, challengeId);
}

export function getUserProfile(userId: string): Promise<UserProfile | null> {
  return gamificationSystem.getUserProfile(userId);
}

export function getLeaderboard(category: 'global' | 'friends' | 'seasonal', limit?: number): Promise<UserProfile[]> {
  return gamificationSystem.getLeaderboard(category, limit);
}