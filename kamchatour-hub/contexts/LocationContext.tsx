import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
}

interface LocationContextType {
  currentLocation: LocationData | null;
  isLoading: boolean;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
  startLocationUpdates: () => Promise<void>;
  stopLocationUpdates: () => void;
  getAddressFromCoords: (lat: number, lng: number) => Promise<string>;
  calculateDistance: (lat1: number, lng1: number, lat2: number, lng2: number) => number;
  getNearbyAttractions: (radius: number) => Promise<Attraction[]>;
}

interface Attraction {
  id: string;
  name: string;
  type: 'volcano' | 'geyser' | 'lake' | 'mountain' | 'hotspring' | 'wildlife';
  latitude: number;
  longitude: number;
  distance: number;
  rating: number;
  description: string;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);

  // Камчатские достопримечательности
  const kamchatkaAttractions: Attraction[] = [
    {
      id: '1',
      name: 'Ключевская сопка',
      type: 'volcano',
      latitude: 56.0569,
      longitude: 160.6428,
      distance: 0,
      rating: 5.0,
      description: 'Самый высокий действующий вулкан Евразии'
    },
    {
      id: '2',
      name: 'Долина гейзеров',
      type: 'geyser',
      latitude: 54.4306,
      longitude: 160.1397,
      distance: 0,
      rating: 5.0,
      description: 'Уникальное скопление гейзеров'
    },
    {
      id: '3',
      name: 'Авачинская сопка',
      type: 'volcano',
      latitude: 53.2556,
      longitude: 158.8306,
      distance: 0,
      rating: 4.8,
      description: 'Символ Петропавловска-Камчатского'
    },
    {
      id: '4',
      name: 'Курильское озеро',
      type: 'lake',
      latitude: 51.4567,
      longitude: 157.1234,
      distance: 0,
      rating: 4.9,
      description: 'Место обитания медведей'
    },
    {
      id: '5',
      name: 'Мутновский вулкан',
      type: 'volcano',
      latitude: 52.4567,
      longitude: 158.1890,
      distance: 0,
      rating: 4.7,
      description: 'Активный вулкан с фумарольными полями'
    },
    {
      id: '6',
      name: 'Термальные источники Паратунки',
      type: 'hotspring',
      latitude: 52.9634,
      longitude: 158.2345,
      distance: 0,
      rating: 4.6,
      description: 'Целебные горячие источники'
    }
  ];

  useEffect(() => {
    checkPermission();
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const checkPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);
      
      if (!granted) {
        Alert.alert(
          'Разрешение на геолокацию',
          'Для полноценной работы приложения необходимо разрешить доступ к геолокации',
          [
            { text: 'Отмена', style: 'cancel' },
            { text: 'Настройки', onPress: () => Location.openSettings() }
          ]
        );
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  };

  const startLocationUpdates = async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) return;
    }

    try {
      setIsLoading(true);
      
      // Получаем текущую локацию
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10
      });

      const locationData: LocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || 0,
        timestamp: location.timestamp,
      };

      setCurrentLocation(locationData);

      // Подписываемся на обновления локации
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
          distanceInterval: 50
        },
        (newLocation) => {
          const updatedLocation: LocationData = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            accuracy: newLocation.coords.accuracy || 0,
            timestamp: newLocation.timestamp,
          };
          setCurrentLocation(updatedLocation);
        }
      );

      setLocationSubscription(subscription);
    } catch (error) {
      console.error('Error starting location updates:', error);
      Alert.alert('Ошибка', 'Не удалось получить вашу локацию');
    } finally {
      setIsLoading(false);
    }
  };

  const stopLocationUpdates = () => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
  };

  const getAddressFromCoords = async (lat: number, lng: number): Promise<string> => {
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const parts = [
          address.city,
          address.region,
          address.country
        ].filter(Boolean);
        
        return parts.join(', ') || 'Неизвестное место';
      }
      
      return 'Неизвестное место';
    } catch (error) {
      console.error('Error getting address:', error);
      return 'Неизвестное место';
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Радиус Земли в километрах
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getNearbyAttractions = async (radius: number): Promise<Attraction[]> => {
    if (!currentLocation) {
      return [];
    }

    const nearbyAttractions = kamchatkaAttractions.map(attraction => ({
      ...attraction,
      distance: calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        attraction.latitude,
        attraction.longitude
      )
    }))
    .filter(attraction => attraction.distance <= radius)
    .sort((a, b) => a.distance - b.distance);

    return nearbyAttractions;
  };

  const value: LocationContextType = {
    currentLocation,
    isLoading,
    hasPermission,
    requestPermission,
    startLocationUpdates,
    stopLocationUpdates,
    getAddressFromCoords,
    calculateDistance,
    getNearbyAttractions,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};