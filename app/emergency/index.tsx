import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useEmergency } from '../../hooks/useEmergency';
import { useLocation } from '../../hooks/useLocation';

export default function EmergencyScreen() {
  const { sendSOS, isLoading } = useEmergency();
  const { getCurrentLocation, requestPermissions } = useLocation();

  const handleSendSOS = async () => {
    try {
      const granted = await requestPermissions();
      if (!granted) {
        Alert.alert('Нет доступа к геолокации', 'Разрешите доступ к местоположению для отправки SOS');
        return;
      }

      const current = await getCurrentLocation();
      if (!current) {
        Alert.alert('Ошибка', 'Не удалось получить текущее местоположение');
        return;
      }

      await sendSOS(current.coordinates, 'SOS: Нужна помощь', 'other');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
      Alert.alert('Ошибка SOS', message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Экстренная помощь</Text>
      <Text style={styles.subtitle}>Отправьте SOS сигнал с текущими координатами</Text>
      <Button title={isLoading ? 'Отправка...' : 'Отправить SOS'} onPress={handleSendSOS} disabled={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
});

