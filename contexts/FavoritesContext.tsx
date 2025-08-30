import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FavoriteKind = 'tours' | 'activities' | 'accommodations';

export interface FavoriteItem {
  id: string;
  kind: FavoriteKind;
  title: string;
  subtitle?: string;
  emoji?: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  isFavorite: (id: string, kind: FavoriteKind) => boolean;
  addFavorite: (item: FavoriteItem) => Promise<void>;
  removeFavorite: (id: string, kind: FavoriteKind) => Promise<void>;
  toggleFavorite: (item: FavoriteItem) => Promise<void>;
  clearFavorites: () => Promise<void>;
}

const STORAGE_KEY = 'favorites';

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavoritesContext = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavoritesContext must be used within FavoritesProvider');
  return ctx;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (data) setFavorites(JSON.parse(data));
      } catch (e) {
        console.error('Failed to load favorites', e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch (e) {
        console.error('Failed to persist favorites', e);
      }
    })();
  }, [favorites]);

  const isFavorite = useCallback((id: string, kind: FavoriteKind) =>
    favorites.some(f => f.id === id && f.kind === kind), [favorites]);

  const addFavorite = useCallback(async (item: FavoriteItem) => {
    setFavorites(prev => (prev.some(f => f.id === item.id && f.kind === item.kind) ? prev : [item, ...prev]));
  }, []);

  const removeFavorite = useCallback(async (id: string, kind: FavoriteKind) => {
    setFavorites(prev => prev.filter(f => !(f.id === id && f.kind === kind)));
  }, []);

  const toggleFavorite = useCallback(async (item: FavoriteItem) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === item.id && f.kind === item.kind);
      if (exists) return prev.filter(f => !(f.id === item.id && f.kind === item.kind));
      return [item, ...prev];
    });
  }, []);

  const clearFavorites = useCallback(async () => setFavorites([]), []);

  const value = useMemo<FavoritesContextType>(() => ({
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
  }), [favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite, clearFavorites]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

