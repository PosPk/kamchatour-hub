import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TotemType = 'bear' | 'volcano' | 'salmon';

interface TotemState {
	bear: number;
	volcano: number;
	salmon: number;
	award: (type: TotemType, points: number, reason?: string) => Promise<void>;
	pending: number;
}

const STORAGE_KEY = 'totems_state_v1';
const DAILY_KEY = 'totems_daily_v1';
const DAILY_LIMIT = 1000;

const TotemContext = createContext<TotemState | undefined>(undefined);

export const TotemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [bear, setBear] = useState<number>(0);
	const [volcano, setVolcano] = useState<number>(0);
	const [salmon, setSalmon] = useState<number>(0);
	const [pending] = useState<number>(0);

	useEffect(() => {
		(async () => {
			try {
				const raw = await AsyncStorage.getItem(STORAGE_KEY);
				if (raw) {
					const parsed = JSON.parse(raw);
					setBear(parsed.bear ?? 0);
					setVolcano(parsed.volcano ?? 0);
					setSalmon(parsed.salmon ?? 0);
				}
			} catch {}
		})();
	}, []);

	const save = useCallback(async (next: { bear: number; volcano: number; salmon: number }) => {
		await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
	}, []);

	const withinDailyLimit = useCallback(async (points: number) => {
		const today = new Date().toISOString().slice(0, 10);
		const raw = await AsyncStorage.getItem(DAILY_KEY);
		let data = { date: today, total: 0 } as { date: string; total: number };
		if (raw) {
			try { data = JSON.parse(raw); } catch {}
		}
		if (data.date !== today) data = { date: today, total: 0 };
		if (data.total + points > DAILY_LIMIT) return false;
		data.total += points;
		await AsyncStorage.setItem(DAILY_KEY, JSON.stringify(data));
		return true;
	}, []);

	const award = useCallback(async (type: TotemType, points: number, _reason?: string) => {
		if (points <= 0) return;
		const allowed = await withinDailyLimit(points);
		if (!allowed) return;
		if (type === 'bear') setBear(prev => { const next = prev + points; save({ bear: next, volcano, salmon }); return next; });
		if (type === 'volcano') setVolcano(prev => { const next = prev + points; save({ bear, volcano: next, salmon }); return next; });
		if (type === 'salmon') setSalmon(prev => { const next = prev + points; save({ bear, volcano, salmon: next }); return next; });
		// Note: server sync will be added when Supabase is ready
	}, [bear, volcano, salmon, save, withinDailyLimit]);

	const value = useMemo(() => ({ bear, volcano, salmon, award, pending }), [bear, volcano, salmon, award, pending]);

	return <TotemContext.Provider value={value}>{children}</TotemContext.Provider>;
};

export const useTotems = (): TotemState => {
	const ctx = useContext(TotemContext);
	if (!ctx) throw new Error('useTotems must be used within TotemProvider');
	return ctx;
};

