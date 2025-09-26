import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FavoriteKind } from './FavoritesContext';

export interface Boost {
  id: string;
  title: string;
  description?: string;
  percent: number; // 0-100
  appliesTo: FavoriteKind | 'all';
  active: boolean;
}

interface BoostsContextType {
  boosts: Boost[];
  toggleBoost: (id: string) => Promise<void>;
  getDiscountFor: (kind: FavoriteKind) => number;
  deactivateAll: () => Promise<void>;
}

const STORAGE_KEY = 'boosts';

const defaultBoosts: Boost[] = [
  { id: 'b1', title: 'Скидка на туры -10%', percent: 10, appliesTo: 'tours', active: false },
  { id: 'b2', title: 'Активности -5%', percent: 5, appliesTo: 'activities', active: false },
  { id: 'b3', title: 'Проживание -7%', percent: 7, appliesTo: 'accommodations', active: false },
];

const BoostsContext = createContext<BoostsContextType | undefined>(undefined);

export const useBoostsContext = () => {
  const ctx = useContext(BoostsContext);
  if (!ctx) throw new Error('useBoostsContext must be used within BoostsProvider');
  return ctx;
};

export const BoostsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [boosts, setBoosts] = useState<Boost[]>(defaultBoosts);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Boost[];
          setBoosts(prev => {
            // merge with defaults to keep new boosts
            const map = new Map<string, Boost>();
            [...defaultBoosts, ...parsed].forEach(b => map.set(b.id, b));
            return Array.from(map.values());
          });
        }
      } catch (e) {
        console.error('Failed to load boosts', e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(boosts));
      } catch (e) {
        console.error('Failed to persist boosts', e);
      }
    })();
  }, [boosts]);

  const toggleBoost = useCallback(async (id: string) => {
    setBoosts(prev => prev.map(b => (b.id === id ? { ...b, active: !b.active } : b)));
  }, []);

  const deactivateAll = useCallback(async () => {
    setBoosts(prev => prev.map(b => ({ ...b, active: false })));
  }, []);

  const getDiscountFor = useCallback((kind: FavoriteKind) => {
    return boosts
      .filter(b => b.active && (b.appliesTo === kind || b.appliesTo === 'all'))
      .reduce((acc, b) => acc + b.percent, 0);
  }, [boosts]);

  const value = useMemo<BoostsContextType>(() => ({ boosts, toggleBoost, getDiscountFor, deactivateAll }), [boosts, toggleBoost, getDiscountFor, deactivateAll]);

  return <BoostsContext.Provider value={value}>{children}</BoostsContext.Provider>;
};

