import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from '../../hooks/useLocation';
import { sendEmergencySignal } from '../../lib/emergency';

const featuredTours = [
  { id: 'v1', title: 'Вулканы и кратеры', price: 35000, days: 3, image: 'https://images.unsplash.com/photo-1583130205156-8ab07afd9bba?q=80&w=1200&auto=format&fit=crop' },
  { id: 'b1', title: 'Медведи на нересте', price: 42000, days: 4, image: 'https://images.unsplash.com/photo-1501706362039-c06b2d715385?q=80&w=1200&auto=format&fit=crop' },
  { id: 'f1', title: 'Сёрф и океан', price: 39000, days: 2, image: 'https://images.unsplash.com/photo-1466096115517-bceecbfb6fde?q=80&w=1200&auto=format&fit=crop' },
  { id: 'h1', title: 'Вертолёт к Толбачику', price: 120000, days: 1, image: 'https://images.unsplash.com/photo-1465447142348-e9952c393450?q=80&w=1200&auto=format&fit=crop' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { location } = useLocation();

  const handleEmergency = useCallback(async () => {
    if (!location) {
      Alert.alert('Ошибка', 'Не удалось определить местоположение');
      return;
    }

    Alert.alert(
      'SOS Сигнал',
      'Отправить сигнал бедствия?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Отправить',
          style: 'destructive',
          onPress: async () => {
            try {
              await sendEmergencySignal({ coordinates: location.coordinates, note: 'SOS сигнал' });
              Alert.alert('Успешно', 'SOS сигнал отправлен');
            } catch {
              Alert.alert('Ошибка', 'Не удалось отправить сигнал');
            }
          },
        },
      ]
    );
  }, [location]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>
            Добро пожаловать на Камчатку! 🏔️
          </Text>
          {user && (
            <Text style={styles.userText}>
              {user.name || user.email}
            </Text>
          )}
        </View>

        {/* Emergency SOS Button */}
        <View style={styles.emergencySection}>
          <Text style={styles.sectionTitle}>Безопасность</Text>
          <View style={styles.sosButton} onTouchEnd={handleEmergency}>
            <Ionicons name="warning" size={32} color="#ffffff" />
            <Text style={styles.sosText}>SOS</Text>
          </View>
          <Text style={styles.sosDescription}>
            Нажмите в экстренной ситуации
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Быстрые действия</Text>
          
          <View style={styles.actionGrid}>
            <View style={styles.actionItem} onTouchEnd={() => router.push('/culture')}>
              <Ionicons name="people" size={24} color="#0891b2" />
              <Text style={styles.actionText}>Культура</Text>
            </View>
            
            <View style={styles.actionItem} onTouchEnd={() => router.push('/eco')}>
              <Ionicons name="leaf" size={24} color="#0891b2" />
              <Text style={styles.actionText}>Экология</Text>
            </View>
            
            <View style={styles.actionItem} onTouchEnd={() => router.push('/booking')}>
              <Ionicons name="calendar" size={24} color="#0891b2" />
              <Text style={styles.actionText}>Бронирование</Text>
            </View>
            
            <View style={styles.actionItem} onTouchEnd={() => router.push('/emergency')}>
              <Ionicons name="medical" size={24} color="#0891b2" />
              <Text style={styles.actionText}>Убежища</Text>
            </View>
          </View>
        </View>

        {/* Featured Tours */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Популярные туры</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
            {featuredTours.map(t => (
              <View key={t.id} style={styles.card}>
                <Image source={{ uri: t.image }} resizeMode="cover" style={styles.cardImage} />
                <View style={styles.cardBadge}><Text style={styles.cardBadgeText}>{t.days} дн.</Text></View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{t.title}</Text>
                  <Text style={styles.cardPrice}>{t.price.toLocaleString('ru-RU')} ₽</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Weather Info */}
        <View style={styles.weatherSection}>
          <Text style={styles.sectionTitle}>Погода</Text>
          <View style={styles.weatherCard}>
            <Ionicons name="partly-sunny" size={32} color="#f59e0b" />
            <Text style={styles.weatherText}>+15°C</Text>
            <Text style={styles.weatherDescription}>Переменная облачность</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#0891b2',
    padding: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  userText: {
    fontSize: 16,
    color: '#e0f2fe',
  },
  emergencySection: {
    padding: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  sosButton: {
    backgroundColor: '#dc2626',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sosText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  sosDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  quickActions: {
    padding: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    backgroundColor: '#ffffff',
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  weatherSection: {
    padding: 20,
  },
  weatherCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  weatherText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 8,
  },
  weatherDescription: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
});