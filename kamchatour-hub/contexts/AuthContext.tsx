import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  achievements: Achievement[];
  level: number;
  experience: number;
}

interface UserPreferences {
  interests: string[];
  difficulty: string;
  budget: string;
  groupSize: string;
  transportation: string;
  notifications: boolean;
  language: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserToStorage = async (userData: User) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Проверка учетных данных (в реальном приложении здесь будет API)
      if (email === 'demo@kamchatour.com' && password === 'demo123') {
        const mockUser: User = {
          id: '1',
          email: 'demo@kamchatour.com',
          name: 'Демо Пользователь',
          avatar: 'https://via.placeholder.com/100',
          preferences: {
            interests: ['Вулканы', 'Природа', 'Фотография'],
            difficulty: 'Средний',
            budget: 'Средний',
            groupSize: '2-4 человека',
            transportation: 'Автомобиль',
            notifications: true,
            language: 'ru'
          },
          achievements: [
            {
              id: '1',
              name: 'Первый шаг',
              description: 'Зарегистрировались в приложении',
              icon: '🎯',
              unlockedAt: new Date()
            }
          ],
          level: 1,
          experience: 0
        };
        
        setUser(mockUser);
        await saveUserToStorage(mockUser);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        preferences: {
          interests: [],
          difficulty: 'Средний',
          budget: 'Средний',
          groupSize: '2-4 человека',
          transportation: 'Автомобиль',
          notifications: true,
          language: 'ru'
        },
        achievements: [
          {
            id: '1',
            name: 'Первый шаг',
            description: 'Зарегистрировались в приложении',
            icon: '🎯',
            unlockedAt: new Date()
          }
        ],
        level: 1,
        experience: 0
      };
      
      setUser(newUser);
      await saveUserToStorage(newUser);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (updates: Partial<User>): Promise<void> => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      await saveUserToStorage(updatedUser);
    }
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>): Promise<void> => {
    if (user) {
      const updatedPreferences = { ...user.preferences, ...preferences };
      const updatedUser = { ...user, preferences: updatedPreferences };
      setUser(updatedUser);
      await saveUserToStorage(updatedUser);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    updatePreferences,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};