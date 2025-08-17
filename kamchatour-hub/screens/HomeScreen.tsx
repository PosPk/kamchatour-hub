import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const [currentLocation, setCurrentLocation] = useState('Петропавловск-Камчатский');

  const features = [
    {
      id: 'quantum',
      title: 'Квантовый маршрут',
      subtitle: 'AI-планировщик с квантовыми алгоритмами',
      icon: 'quantum-entanglement',
      color: ['#667eea', '#764ba2'],
      route: 'QuantumRoute'
    },
    {
      id: 'destinations',
      title: 'Направления',
      subtitle: 'Лучшие места Камчатки',
      icon: 'map-marker',
      color: ['#f093fb', '#f5576c'],
      route: 'Destinations'
    },
    {
      id: 'insurance',
      title: 'Страхование',
      subtitle: 'Защита вашего путешествия',
      icon: 'shield-check',
      color: ['#4facfe', '#00f2fe'],
      route: 'Insurance'
    },
    {
      id: 'boosts',
      title: 'Премиум услуги',
      subtitle: 'Эксклюзивные впечатления',
      icon: 'star',
      color: ['#43e97b', '#38f9d7'],
      route: 'Boosts'
    },
    {
      id: 'photos',
      title: 'Фотоотчеты',
      subtitle: 'Впечатления туристов',
      icon: 'camera',
      color: ['#fa709a', '#fee140'],
      route: 'PhotoReports'
    },
    {
      id: 'ar-vr',
      title: 'AR/VR тур',
      subtitle: 'Виртуальное путешествие',
      icon: 'vr-headset',
      color: ['#a8edea', '#fed6e3'],
      route: 'ARVR'
    }
  ];

  const handleFeaturePress = (route: string) => {
    navigation.navigate(route as never);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Заголовок */}
      <LinearGradient
        colors={['#4A90E2', '#357ABD']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Добро пожаловать в</Text>
          <Text style={styles.appTitle}>Kamchatour Hub</Text>
          <Text style={styles.subtitle}>Откройте для себя магию Камчатки</Text>
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={20} color="#fff" />
            <Text style={styles.locationText}>{currentLocation}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Квантовый планировщик */}
      <View style={styles.quantumSection}>
        <Text style={styles.sectionTitle}>🎯 Квантовый планировщик маршрутов</Text>
        <Text style={styles.sectionSubtitle}>
          Используйте передовые AI и квантовые алгоритмы для создания идеального маршрута
        </Text>
        <TouchableOpacity
          style={styles.quantumButton}
          onPress={() => handleFeaturePress('QuantumRoute')}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.quantumButtonGradient}
          >
            <MaterialCommunityIcons name="quantum-entanglement" size={32} color="#fff" />
            <Text style={styles.quantumButtonText}>Создать квантовый маршрут</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Основные функции */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>🚀 Основные функции</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={styles.featureCard}
              onPress={() => handleFeaturePress(feature.route)}
            >
              <LinearGradient
                colors={feature.color}
                style={styles.featureGradient}
              >
                <MaterialCommunityIcons 
                  name={feature.icon as any} 
                  size={28} 
                  color="#fff" 
                />
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Статистика */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>📊 Статистика Камчатки</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>29</Text>
            <Text style={styles.statLabel}>Активных вулканов</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>160</Text>
            <Text style={styles.statLabel}>Минеральных источников</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>1000+</Text>
            <Text style={styles.statLabel}>Медведей</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Поддержка</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 8,
  },
  appTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  locationText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  quantumSection: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  quantumButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  quantumButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  quantumButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  featuresSection: {
    padding: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  featureGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
  },
  featureTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  featureSubtitle: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.9,
  },
  statsSection: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 80) / 2,
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});