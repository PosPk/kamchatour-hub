import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
}

export interface LocationData {
  coordinates: Coordinates;
  timestamp: number;
  address?: string;
  region?: string;
  country?: string;
}

interface LocationContextType {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  requestPermissions: () => Promise<boolean>;
  getCurrentLocation: () => Promise<LocationData | null>;
  startLocationUpdates: () => Promise<void>;
  stopLocationUpdates: () => void;
  reverseGeocode: (coordinates: Coordinates) => Promise<string | null>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);

  useEffect(() => {
    checkPermissions();
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const checkPermissions = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        // Permissions already granted, get initial location
        await getCurrentLocation();
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
      setError('Ошибка проверки разрешений');
    }
  };

  const requestPermissions = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        await getCurrentLocation();
        return true;
      } else {
        setError('Разрешение на геолокацию не предоставлено');
        return false;
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      setError('Ошибка запроса разрешений');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = async (): Promise<LocationData | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
        distanceInterval: 10,
      });

      const locationData: LocationData = {
        coordinates: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          accuracy: currentLocation.coords.accuracy,
          altitude: currentLocation.coords.altitude,
          heading: currentLocation.coords.heading,
          speed: currentLocation.coords.speed,
        },
        timestamp: currentLocation.timestamp,
      };

      // Try to get address
      try {
        const address = await reverseGeocode(locationData.coordinates);
        if (address) {
          locationData.address = address;
        }
      } catch (error) {
        console.warn('Could not get address:', error);
      }

      setLocation(locationData);
      return locationData;
    } catch (error) {
      console.error('Error getting current location:', error);
      setError('Не удалось получить текущее местоположение');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const startLocationUpdates = async () => {
    try {
      if (locationSubscription) {
        locationSubscription.remove();
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 30000, // Update every 30 seconds
          distanceInterval: 50, // Update every 50 meters
        },
        (newLocation) => {
          const locationData: LocationData = {
            coordinates: {
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
              accuracy: newLocation.coords.accuracy,
              altitude: newLocation.coords.altitude,
              heading: newLocation.coords.heading,
              speed: newLocation.coords.speed,
            },
            timestamp: newLocation.timestamp,
          };

          setLocation(locationData);
        }
      );

      setLocationSubscription(subscription);
    } catch (error) {
      console.error('Error starting location updates:', error);
      setError('Не удалось запустить отслеживание местоположения');
    }
  };

  const stopLocationUpdates = () => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
  };

  const reverseGeocode = async (coordinates: Coordinates): Promise<string | null> => {
    try {
      const results = await Location.reverseGeocodeAsync({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });

      if (results.length > 0) {
        const result = results[0];
        const parts = [
          result.street,
          result.district,
          result.city,
          result.region,
          result.country,
        ].filter(Boolean);

        return parts.join(', ');
      }

      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  };

  const value: LocationContextType = {
    location,
    isLoading,
    error,
    requestPermissions,
    getCurrentLocation,
    startLocationUpdates,
    stopLocationUpdates,
    reverseGeocode,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};