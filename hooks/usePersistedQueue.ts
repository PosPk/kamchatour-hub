import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
let NetInfo: any;
try { NetInfo = require('@react-native-community/netinfo'); } catch { NetInfo = { fetch: async () => ({ isConnected: true, isInternetReachable: true }) }; }

export type QueueItem = {
  id?: string;
  retryCount?: number;
  [key: string]: any;
};

export interface QueueProcessResult {
  processed: number;
  remaining: number;
}

export const usePersistedQueue = (storageKey: string, maxRetries: number = 6) => {
  const [items, setItems] = useState<QueueItem[]>([]);

  const loadQueue = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(storageKey);
      if (stored) setItems(JSON.parse(stored));
    } catch (error) {
      console.error('Failed to load queue:', error);
    }
  }, [storageKey]);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  const persist = useCallback(
    async (next: QueueItem[]) => {
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(next));
        setItems(next);
      } catch (error) {
        console.error('Failed to save queue:', error);
      }
    },
    [storageKey]
  );

  const addItem = useCallback(
    async (item: QueueItem) => {
      const withRetry: QueueItem = { retryCount: 0, ...item };
      await persist([...items, withRetry]);
    },
    [items, persist]
  );

  const clearQueue = useCallback(async () => {
    await persist([]);
  }, [persist]);

  const processQueue = useCallback(
    async (processor: (item: QueueItem) => Promise<boolean>): Promise<QueueProcessResult> => {
      const remaining: QueueItem[] = [];
      let processedCount = 0;

      for (const item of items) {
        try {
          const ok = await processor(item);
          if (ok) {
            processedCount += 1;
          } else {
            const nextRetry = Math.min(maxRetries, (item.retryCount ?? 0) + 1);
            remaining.push({ ...item, retryCount: nextRetry });
          }
        } catch {
          const nextRetry = Math.min(maxRetries, (item.retryCount ?? 0) + 1);
          remaining.push({ ...item, retryCount: nextRetry });
        }
      }

      await persist(remaining);
      return { processed: processedCount, remaining: remaining.length };
    },
    [items, persist, maxRetries]
  );

  const processWithNetwork = useCallback(
    async (processor: (item: QueueItem) => Promise<boolean>): Promise<QueueProcessResult | undefined> => {
      const state = await NetInfo.fetch();
      if (!state.isConnected || state.isInternetReachable === false) return { processed: 0, remaining: items.length };

      // wrap processor to apply exponential backoff per item
      const wrapped = async (item: QueueItem) => {
        const retry = item.retryCount ?? 0;
        const delayMs = Math.min(2 ** retry * 1000, 30000);
        if (delayMs > 0) await new Promise(resolve => setTimeout(resolve, delayMs));
        return processor(item);
      };

      return processQueue(wrapped);
    },
    [items.length, processQueue]
  );

  return {
    items,
    addItem,
    clearQueue,
    processQueue,
    processWithNetwork,
  };
};

