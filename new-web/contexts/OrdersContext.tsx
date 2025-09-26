import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OrderItem {
  id: string;
  kind: 'tours' | 'activities' | 'accommodations';
  title: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  createdAt: number;
  status: 'created' | 'paid' | 'cancelled';
}

interface OrdersContextType {
  orders: Order[];
  createOrder: (items: OrderItem[]) => Promise<Order>;
  confirmOrder: (orderId: string) => Promise<Order | null>;
  cancelOrder: (orderId: string) => Promise<void>;
  clearOrders: () => Promise<void>;
}

const STORAGE_KEY = 'orders';

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const useOrdersContext = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrdersContext must be used within OrdersProvider');
  return ctx;
};

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setOrders(JSON.parse(raw));
      } catch (e) {
        console.error('Failed to load orders', e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
      } catch (e) {
        console.error('Failed to persist orders', e);
      }
    })();
  }, [orders]);

  const createOrder = useCallback(async (items: OrderItem[]): Promise<Order> => {
    const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const order: Order = {
      id: Date.now().toString(),
      items,
      total,
      createdAt: Date.now(),
      status: 'created',
    };
    setOrders(prev => [order, ...prev]);
    return order;
  }, []);

  const confirmOrder = useCallback(async (orderId: string): Promise<Order | null> => {
    let updated: Order | null = null;
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        updated = { ...o, status: 'paid' };
        return updated;
      }
      return o;
    }));
    return updated;
  }, []);

  const cancelOrder = useCallback(async (orderId: string) => {
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: 'cancelled' } : o)));
  }, []);

  const clearOrders = useCallback(async () => setOrders([]), []);

  const value = useMemo<OrdersContextType>(() => ({ orders, createOrder, confirmOrder, cancelOrder, clearOrders }), [orders, createOrder, confirmOrder, cancelOrder, clearOrders]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};

