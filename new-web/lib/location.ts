import * as ExpoLocation from 'expo-location';
import type { Coordinates } from '../contexts/LocationContext';

export async function requestForegroundPermissions(): Promise<boolean> {
  const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function getCurrentPosition(): Promise<Coordinates | null> {
  try {
    const current = await ExpoLocation.getCurrentPositionAsync({ accuracy: ExpoLocation.Accuracy.High });
    return {
      latitude: current.coords.latitude,
      longitude: current.coords.longitude,
      accuracy: current.coords.accuracy ?? undefined,
      altitude: current.coords.altitude ?? undefined,
      heading: current.coords.heading ?? undefined,
      speed: current.coords.speed ?? undefined,
    };
  } catch (error) {
    console.error('getCurrentPosition error:', error);
    return null;
  }
}

export async function reverseGeocode(coordinates: Coordinates): Promise<string | null> {
  try {
    const results = await ExpoLocation.reverseGeocodeAsync({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    });
    if (results.length === 0) return null;
    const r = results[0];
    const parts = [r.street, r.district, r.city, r.region, r.country].filter(Boolean);
    return parts.join(', ');
  } catch (error) {
    console.error('reverseGeocode error:', error);
    return null;
  }
}

