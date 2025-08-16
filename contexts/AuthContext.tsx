import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signIn as authSignIn, signUp as authSignUp, signOut as authSignOut } from '../lib/auth';

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  emergencyContacts?: EmergencyContact[];
  preferences?: UserPreferences;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface UserPreferences {
  language: 'ru' | 'en';
  notifications: boolean;
  emergencyAlerts: boolean;
  locationSharing: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => Promise<void>;
  removeEmergencyContact: (contactId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserToStorage = async (userData: User | null) => {
    try {
      if (userData) {
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userData = await authSignIn(email, password);
      setUser(userData);
      await saveUserToStorage(userData);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const userData = await authSignUp(email, password, name);
      setUser(userData);
      await saveUserToStorage(userData);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await authSignOut();
      setUser(null);
      await saveUserToStorage(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      await saveUserToStorage(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const addEmergencyContact = async (contact: Omit<EmergencyContact, 'id'>) => {
    if (!user) return;
    
    try {
      const newContact: EmergencyContact = {
        ...contact,
        id: Date.now().toString(),
      };
      
      const updatedUser = {
        ...user,
        emergencyContacts: [...(user.emergencyContacts || []), newContact],
      };
      
      setUser(updatedUser);
      await saveUserToStorage(updatedUser);
    } catch (error) {
      console.error('Add emergency contact error:', error);
      throw error;
    }
  };

  const removeEmergencyContact = async (contactId: string) => {
    if (!user) return;
    
    try {
      const updatedUser = {
        ...user,
        emergencyContacts: (user.emergencyContacts || []).filter(
          contact => contact.id !== contactId
        ),
      };
      
      setUser(updatedUser);
      await saveUserToStorage(updatedUser);
    } catch (error) {
      console.error('Remove emergency contact error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateUser,
    addEmergencyContact,
    removeEmergencyContact,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};