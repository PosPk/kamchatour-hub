import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../contexts/AuthContext';

// Mock user database - in real app this would be an API
const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@kamchatka.ru',
    name: 'Демо Пользователь',
    phone: '+7 (999) 123-45-67',
    emergencyContacts: [
      {
        id: '1',
        name: 'Иван Иванов',
        phone: '+7 (999) 111-11-11',
        relationship: 'Друг',
      },
    ],
    preferences: {
      language: 'ru',
      notifications: true,
      emergencyAlerts: true,
      locationSharing: true,
    },
  },
];

export const signIn = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Validate credentials
  if (!email || !password) {
    throw new Error('Email и пароль обязательны');
  }

  if (password.length < 6) {
    throw new Error('Пароль должен содержать минимум 6 символов');
  }

  // Find user
  const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    throw new Error('Пользователь не найден');
  }

  // In real app, validate password hash
  if (password !== 'demo123') {
    throw new Error('Неверный пароль');
  }

  // Store session
  await AsyncStorage.setItem('session', JSON.stringify({ userId: user.id, timestamp: Date.now() }));

  return user;
};

export const signUp = async (email: string, password: string, name: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Validate input
  if (!email || !password || !name) {
    throw new Error('Все поля обязательны');
  }

  if (password.length < 6) {
    throw new Error('Пароль должен содержать минимум 6 символов');
  }

  if (!email.includes('@')) {
    throw new Error('Неверный формат email');
  }

  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    throw new Error('Пользователь с таким email уже существует');
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    preferences: {
      language: 'ru',
      notifications: true,
      emergencyAlerts: true,
      locationSharing: true,
    },
  };

  // Add to mock database
  mockUsers.push(newUser);

  // Store session
  await AsyncStorage.setItem('session', JSON.stringify({ userId: newUser.id, timestamp: Date.now() }));

  return newUser;
};

export const signOut = async (): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Remove session
  await AsyncStorage.removeItem('session');
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const sessionData = await AsyncStorage.getItem('session');
    if (!sessionData) return null;

    const session = JSON.parse(sessionData);
    const user = mockUsers.find(u => u.id === session.userId);
    
    return user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    throw new Error('Пользователь не найден');
  }

  // Update user
  mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };

  return mockUsers[userIndex];
};

export const changePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Validate current password
  if (currentPassword !== 'demo123') {
    throw new Error('Неверный текущий пароль');
  }

  // Validate new password
  if (newPassword.length < 6) {
    throw new Error('Новый пароль должен содержать минимум 6 символов');
  }

  // In real app, update password hash
  console.log('Password changed for user:', userId);
};

export const resetPassword = async (email: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error('Пользователь не найден');
  }

  // In real app, send reset email
  console.log('Password reset email sent to:', email);
};