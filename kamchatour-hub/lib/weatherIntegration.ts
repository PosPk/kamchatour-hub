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