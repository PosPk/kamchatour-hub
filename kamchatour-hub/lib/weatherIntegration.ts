export type WeatherNow = { temperatureC: number; condition: string };

const cache = new Map<string, { value: WeatherNow; ts: number }>();
const FIVE_MIN = 5 * 60 * 1000;

export async function getCurrentWeather(_lat: number, _lng: number): Promise<WeatherNow> {
	const key = `${_lat.toFixed(3)}:${_lng.toFixed(3)}`;
	const now = Date.now();
	const hit = cache.get(key);
	if (hit && now - hit.ts < FIVE_MIN) return hit.value;
	const value = { temperatureC: 5, condition: 'Cloudy' };
	cache.set(key, { value, ts: now });
	return value;
}

import { useQuery } from '@tanstack/react-query';
export function useWeather(lat?: number, lng?: number) {
	return useQuery({
		queryKey: ['weather', lat?.toFixed(3), lng?.toFixed(3)],
		queryFn: async () => {
			if (typeof lat !== 'number' || typeof lng !== 'number') throw new Error('coords');
			return getCurrentWeather(lat, lng);
		},
		enabled: typeof lat === 'number' && typeof lng === 'number',
		staleTime: FIVE_MIN
	});
}