import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { executeQuery, executeTransaction } from '../database/config';

// Конфигурация JWT
export interface JWTConfig {
  secret: string;
  expiresIn: string;
  refreshExpiresIn: string;
}

export const jwtConfig: JWTConfig = {
  secret: process.env.JWT_SECRET || 'kamchatour-super-secret-key-2024',
  expiresIn: '24h',
  refreshExpiresIn: '7d'
};

// Интерфейсы пользователей
export interface User {
  id: string;
  email: string;
  phone?: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserRegistration {
  email: string;
  phone?: string;
  password: string;
  first_name: string;
  last_name: string;
  date_of_birth?: Date;
  gender?: string;
  nationality?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  bio?: string;
  interests?: string[];
  languages?: string[];
  experience_level?: string;
  fitness_level?: string;
  preferred_activities?: string[];
  budget_range?: string;
  travel_style?: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  max_group_size: number;
  preferred_duration_min: number;
  preferred_duration_max: number;
  preferred_seasons?: string[];
  accessibility_requirements?: string[];
  dietary_restrictions?: string[];
  accommodation_preferences?: string[];
  transportation_preferences?: string[];
}

// Интерфейсы токенов
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenData {
  user_id: string;
  token: string;
  expires_at: Date;
  is_revoked: boolean;
}

// Интерфейсы 2FA
export interface TwoFactorAuth {
  user_id: string;
  secret: string;
  backup_codes: string[];
  is_enabled: boolean;
  created_at: Date;
}

export interface TwoFactorVerification {
  user_id: string;
  code: string;
  expires_at: Date;
}

// Интерфейсы OAuth
export interface OAuthProvider {
  id: string;
  name: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  scope: string[];
  is_active: boolean;
}

export interface OAuthAccount {
  id: string;
  user_id: string;
  provider: string;
  provider_user_id: string;
  access_token: string;
  refresh_token?: string;
  expires_at?: Date;
  created_at: Date;
}

export class AuthenticationSystem {
  private saltRounds = 12;
  private twoFactorSecretLength = 32;
  private backupCodesCount = 10;

  constructor() {
    this.initializeAuthSystem();
  }

  private async initializeAuthSystem() {
    console.log('🔐 Инициализация системы аутентификации...');
    
    // Создание таблиц для аутентификации, если их нет
    await this.createAuthTables();
    
    console.log('✅ Система аутентификации готова!');
  }

  private async createAuthTables(): Promise<void> {
    try {
      // Таблица для refresh токенов
      await executeQuery(`
        CREATE TABLE IF NOT EXISTS refresh_tokens (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          token VARCHAR(500) NOT NULL UNIQUE,
          expires_at TIMESTAMP NOT NULL,
          is_revoked BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Таблица для 2FA
      await executeQuery(`
        CREATE TABLE IF NOT EXISTS two_factor_auth (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
          secret VARCHAR(100) NOT NULL,
          backup_codes TEXT[] NOT NULL,
          is_enabled BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Таблица для OAuth аккаунтов
      await executeQuery(`
        CREATE TABLE IF NOT EXISTS oauth_accounts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          provider VARCHAR(50) NOT NULL,
          provider_user_id VARCHAR(255) NOT NULL,
          access_token TEXT NOT NULL,
          refresh_token TEXT,
          expires_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(provider, provider_user_id)
        )
      `);

      // Индексы
      await executeQuery('CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens (user_id)');
      await executeQuery('CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens (token)');
      await executeQuery('CREATE INDEX IF NOT EXISTS idx_oauth_accounts_user_id ON oauth_accounts (user_id)');
      await executeQuery('CREATE INDEX IF NOT EXISTS idx_oauth_accounts_provider ON oauth_accounts (provider)');

    } catch (error) {
      console.error('Ошибка создания таблиц аутентификации:', error);
      throw error;
    }
  }

  // Регистрация пользователя
  async registerUser(userData: UserRegistration): Promise<User> {
    try {
      // Проверка существования пользователя
      const existingUser = await executeQuery<User>(
        'SELECT id FROM users WHERE email = $1',
        [userData.email]
      );

      if (existingUser.length > 0) {
        throw new Error('Пользователь с таким email уже существует');
      }

      // Хеширование пароля
      const passwordHash = await bcrypt.hash(userData.password, this.saltRounds);

      // Создание пользователя
      const result = await executeTransaction<{ id: string }>([
        {
          query: `
            INSERT INTO users (email, phone, password_hash, first_name, last_name, date_of_birth, gender, nationality)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
          `,
          params: [
            userData.email,
            userData.phone,
            passwordHash,
            userData.first_name,
            userData.last_name,
            userData.date_of_birth,
            userData.gender,
            userData.nationality
          ]
        },
        {
          query: `
            INSERT INTO user_profiles (user_id)
            VALUES ($1)
          `,
          params: [result[0].id]
        },
        {
          query: `
            INSERT INTO user_preferences (user_id)
            VALUES ($1)
          `,
          params: [result[0].id]
        }
      ]);

      // Получение созданного пользователя
      const newUser = await executeQuery<User>(
        'SELECT * FROM users WHERE id = $1',
        [result[0].id]
      );

      return newUser[0];
    } catch (error) {
      console.error('Ошибка регистрации пользователя:', error);
      throw error;
    }
  }

  // Аутентификация пользователя
  async loginUser(loginData: UserLogin): Promise<TokenPair> {
    try {
      // Поиск пользователя
      const users = await executeQuery<User & { password_hash: string }>(
        'SELECT * FROM users WHERE email = $1 AND is_active = TRUE',
        [loginData.email]
      );

      if (users.length === 0) {
        throw new Error('Неверный email или пароль');
      }

      const user = users[0];

      // Проверка пароля
      const isPasswordValid = await bcrypt.compare(loginData.password, user.password_hash);
      if (!isPasswordValid) {
        throw new Error('Неверный email или пароль');
      }

      // Обновление времени последнего входа
      await executeQuery(
        'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );

      // Генерация токенов
      const tokenPair = await this.generateTokenPair(user.id);

      return tokenPair;
    } catch (error) {
      console.error('Ошибка аутентификации:', error);
      throw error;
    }
  }

  // Генерация пары токенов
  private async generateTokenPair(userId: string): Promise<TokenPair> {
    const accessToken = jwt.sign(
      { user_id: userId, type: 'access' },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    const refreshToken = crypto.randomBytes(64).toString('hex');
    const expiresIn = this.calculateExpiresIn(jwtConfig.expiresIn);

    // Сохранение refresh токена
    await executeQuery(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, refreshToken, new Date(Date.now() + expiresIn * 1000)]
    );

    return {
      accessToken,
      refreshToken,
      expiresIn
    };
  }

  // Обновление токена
  async refreshToken(refreshToken: string): Promise<TokenPair> {
    try {
      // Поиск refresh токена
      const tokens = await executeQuery<RefreshTokenData>(
        'SELECT * FROM refresh_tokens WHERE token = $1 AND is_revoked = FALSE AND expires_at > CURRENT_TIMESTAMP',
        [refreshToken]
      );

      if (tokens.length === 0) {
        throw new Error('Недействительный refresh токен');
      }

      const tokenData = tokens[0];

      // Отзыв старого токена
      await executeQuery(
        'UPDATE refresh_tokens SET is_revoked = TRUE WHERE id = $1',
        [tokenData.user_id]
      );

      // Генерация новой пары токенов
      const newTokenPair = await this.generateTokenPair(tokenData.user_id);

      return newTokenPair;
    } catch (error) {
      console.error('Ошибка обновления токена:', error);
      throw error;
    }
  }

  // Валидация access токена
  async validateToken(token: string): Promise<string> {
    try {
      const decoded = jwt.verify(token, jwtConfig.secret) as { user_id: string; type: string };
      
      if (decoded.type !== 'access') {
        throw new Error('Неверный тип токена');
      }

      return decoded.user_id;
    } catch (error) {
      console.error('Ошибка валидации токена:', error);
      throw new Error('Недействительный токен');
    }
  }

  // Выход пользователя
  async logoutUser(userId: string, refreshToken?: string): Promise<void> {
    try {
      if (refreshToken) {
        // Отзыв конкретного refresh токена
        await executeQuery(
          'UPDATE refresh_tokens SET is_revoked = TRUE WHERE user_id = $1 AND token = $2',
          [userId, refreshToken]
        );
      } else {
        // Отзыв всех refresh токенов пользователя
        await executeQuery(
          'UPDATE refresh_tokens SET is_revoked = TRUE WHERE user_id = $1',
          [userId]
        );
      }
    } catch (error) {
      console.error('Ошибка выхода пользователя:', error);
      throw error;
    }
  }

  // Настройка 2FA
  async setupTwoFactor(userId: string): Promise<{ secret: string; qrCode: string; backupCodes: string[] }> {
    try {
      // Генерация секрета для 2FA
      const secret = crypto.randomBytes(this.twoFactorSecretLength).toString('base32');
      
      // Генерация резервных кодов
      const backupCodes = Array.from({ length: this.backupCodesCount }, () => 
        crypto.randomBytes(4).toString('hex').toUpperCase()
      );

      // Сохранение в базе данных
      await executeQuery(
        'INSERT INTO two_factor_auth (user_id, secret, backup_codes) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET secret = $2, backup_codes = $3',
        [userId, secret, backupCodes]
      );

      // Генерация QR кода (в реальной системе здесь будет библиотека для QR кодов)
      const qrCode = `otpauth://totp/KamchatourHub:${userId}?secret=${secret}&issuer=KamchatourHub`;

      return {
        secret,
        qrCode,
        backupCodes
      };
    } catch (error) {
      console.error('Ошибка настройки 2FA:', error);
      throw error;
    }
  }

  // Включение 2FA
  async enableTwoFactor(userId: string): Promise<void> {
    try {
      await executeQuery(
        'UPDATE two_factor_auth SET is_enabled = TRUE WHERE user_id = $1',
        [userId]
      );
    } catch (error) {
      console.error('Ошибка включения 2FA:', error);
      throw error;
    }
  }

  // Отключение 2FA
  async disableTwoFactor(userId: string): Promise<void> {
    try {
      await executeQuery(
        'UPDATE two_factor_auth SET is_enabled = FALSE WHERE user_id = $1',
        [userId]
      );
    } catch (error) {
      console.error('Ошибка отключения 2FA:', error);
      throw error;
    }
  }

  // Проверка 2FA кода
  async verifyTwoFactorCode(userId: string, code: string): Promise<boolean> {
    try {
      // В реальной системе здесь будет проверка TOTP кода
      // Для демонстрации используем простую проверку
      const twoFactorData = await executeQuery<TwoFactorAuth>(
        'SELECT * FROM two_factor_auth WHERE user_id = $1 AND is_enabled = TRUE',
        [userId]
      );

      if (twoFactorData.length === 0) {
        return false;
      }

      // Проверка резервных кодов
      if (twoFactorData[0].backup_codes.includes(code)) {
        // Удаление использованного резервного кода
        const updatedBackupCodes = twoFactorData[0].backup_codes.filter(c => c !== code);
        await executeQuery(
          'UPDATE two_factor_auth SET backup_codes = $1 WHERE user_id = $2',
          [updatedBackupCodes, userId]
        );
        return true;
      }

      // Здесь должна быть проверка TOTP кода
      // Для демонстрации возвращаем false
      return false;
    } catch (error) {
      console.error('Ошибка проверки 2FA кода:', error);
      return false;
    }
  }

  // Получение профиля пользователя
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const profiles = await executeQuery<UserProfile>(
        'SELECT * FROM user_profiles WHERE user_id = $1',
        [userId]
      );

      return profiles.length > 0 ? profiles[0] : null;
    } catch (error) {
      console.error('Ошибка получения профиля пользователя:', error);
      return null;
    }
  }

  // Обновление профиля пользователя
  async updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const updateFields = Object.keys(profileData)
        .filter(key => key !== 'id' && key !== 'user_id')
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');

      const updateValues = Object.values(profileData).filter((_, index) => 
        Object.keys(profileData)[index] !== 'id' && Object.keys(profileData)[index] !== 'user_id'
      );

      const query = `
        UPDATE user_profiles 
        SET ${updateFields}, updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = $1 
        RETURNING *
      `;

      const result = await executeQuery<UserProfile>(query, [userId, ...updateValues]);
      
      if (result.length === 0) {
        throw new Error('Профиль пользователя не найден');
      }

      return result[0];
    } catch (error) {
      console.error('Ошибка обновления профиля пользователя:', error);
      throw error;
    }
  }

  // Получение предпочтений пользователя
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const preferences = await executeQuery<UserPreferences>(
        'SELECT * FROM user_preferences WHERE user_id = $1',
        [userId]
      );

      return preferences.length > 0 ? preferences[0] : null;
    } catch (error) {
      console.error('Ошибка получения предпочтений пользователя:', error);
      return null;
    }
  }

  // Обновление предпочтений пользователя
  async updateUserPreferences(userId: string, preferencesData: Partial<UserPreferences>): Promise<UserPreferences> {
    try {
      const updateFields = Object.keys(preferencesData)
        .filter(key => key !== 'id' && key !== 'user_id')
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');

      const updateValues = Object.values(preferencesData).filter((_, index) => 
        Object.keys(preferencesData)[index] !== 'id' && Object.keys(preferencesData)[index] !== 'user_id'
      );

      const query = `
        UPDATE user_preferences 
        SET ${updateFields}, updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = $1 
        RETURNING *
      `;

      const result = await executeQuery<UserPreferences>(query, [userId, ...updateValues]);
      
      if (result.length === 0) {
        throw new Error('Предпочтения пользователя не найдены');
      }

      return result[0];
    } catch (error) {
      console.error('Ошибка обновления предпочтений пользователя:', error);
      throw error;
    }
  }

  // Изменение пароля
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      // Получение текущего хеша пароля
      const users = await executeQuery<{ password_hash: string }>(
        'SELECT password_hash FROM users WHERE id = $1',
        [userId]
      );

      if (users.length === 0) {
        throw new Error('Пользователь не найден');
      }

      // Проверка текущего пароля
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, users[0].password_hash);
      if (!isCurrentPasswordValid) {
        throw new Error('Неверный текущий пароль');
      }

      // Хеширование нового пароля
      const newPasswordHash = await bcrypt.hash(newPassword, this.saltRounds);

      // Обновление пароля
      await executeQuery(
        'UPDATE users SET password_hash = $1 WHERE id = $2',
        [newPasswordHash, userId]
      );

      // Отзыв всех refresh токенов
      await this.logoutUser(userId);
    } catch (error) {
      console.error('Ошибка изменения пароля:', error);
      throw error;
    }
  }

  // Сброс пароля
  async resetPassword(email: string): Promise<string> {
    try {
      // Генерация токена для сброса пароля
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 часа

      // Сохранение токена в базе данных
      await executeQuery(
        'UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE email = $3',
        [resetToken, expiresAt, email]
      );

      // В реальной системе здесь будет отправка email
      console.log(`Токен для сброса пароля: ${resetToken}`);

      return resetToken;
    } catch (error) {
      console.error('Ошибка сброса пароля:', error);
      throw error;
    }
  }

  // Подтверждение сброса пароля
  async confirmPasswordReset(resetToken: string, newPassword: string): Promise<void> {
    try {
      // Поиск пользователя с действительным токеном
      const users = await executeQuery<{ id: string }>(
        'SELECT id FROM users WHERE password_reset_token = $1 AND password_reset_expires > CURRENT_TIMESTAMP',
        [resetToken]
      );

      if (users.length === 0) {
        throw new Error('Недействительный или истекший токен для сброса пароля');
      }

      // Хеширование нового пароля
      const newPasswordHash = await bcrypt.hash(newPassword, this.saltRounds);

      // Обновление пароля и очистка токена
      await executeQuery(
        'UPDATE users SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL WHERE id = $2',
        [newPasswordHash, users[0].id]
      );

      // Отзыв всех refresh токенов
      await this.logoutUser(users[0].id);
    } catch (error) {
      console.error('Ошибка подтверждения сброса пароля:', error);
      throw error;
    }
  }

  // Вспомогательные методы
  private calculateExpiresIn(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1));

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 60 * 60;
      case 'd': return value * 24 * 60 * 60;
      default: return 24 * 60 * 60; // 24 часа по умолчанию
    }
  }
}

// Экспорт системы
export const authSystem = new AuthenticationSystem();

// Экспорт основных функций
export function registerUser(userData: UserRegistration): Promise<User> {
  return authSystem.registerUser(userData);
}

export function loginUser(loginData: UserLogin): Promise<TokenPair> {
  return authSystem.loginUser(loginData);
}

export function refreshToken(refreshToken: string): Promise<TokenPair> {
  return authSystem.refreshToken(refreshToken);
}

export function validateToken(token: string): Promise<string> {
  return authSystem.validateToken(token);
}

export function logoutUser(userId: string, refreshToken?: string): Promise<void> {
  return authSystem.logoutUser(userId, refreshToken);
}

export function setupTwoFactor(userId: string): Promise<{ secret: string; qrCode: string; backupCodes: string[] }> {
  return authSystem.setupTwoFactor(userId);
}

export function enableTwoFactor(userId: string): Promise<void> {
  return authSystem.enableTwoFactor(userId);
}

export function disableTwoFactor(userId: string): Promise<void> {
  return authSystem.disableTwoFactor(userId);
}

export function verifyTwoFactorCode(userId: string, code: string): Promise<boolean> {
  return authSystem.verifyTwoFactorCode(userId, code);
}

export function getUserProfile(userId: string): Promise<UserProfile | null> {
  return authSystem.getUserProfile(userId);
}

export function updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
  return authSystem.updateUserProfile(userId, profileData);
}

export function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  return authSystem.getUserPreferences(userId);
}

export function updateUserPreferences(userId: string, preferencesData: Partial<UserPreferences>): Promise<UserPreferences> {
  return authSystem.updateUserPreferences(userId, preferencesData);
}

export function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
  return authSystem.changePassword(userId, currentPassword, newPassword);
}

export function resetPassword(email: string): Promise<string> {
  return authSystem.resetPassword(email);
}

export function confirmPasswordReset(resetToken: string, newPassword: string): Promise<void> {
  return authSystem.confirmPasswordReset(resetToken, newPassword);
}