import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../../hooks/useLocation';

export default function EcoScreen() {
  const { location } = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const ecoData = {
    airQuality: {
      status: 'Хорошо',
      value: 45,
      color: '#10b981',
      description: 'Воздух чистый, подходит для активного отдыха',
    },
    waterQuality: {
      status: 'Отлично',
      value: 15,
      color: '#3b82f6',
      description: 'Вода кристально чистая, пригодна для питья',
    },
    wildlifeActivity: {
      status: 'Высокая',
      value: 85,
      color: '#f59e0b',
      description: 'Активность диких животных повышена',
    },
    weatherConditions: {
      status: 'Стабильно',
      value: 70,
      color: '#8b5cf6',
      description: 'Погодные условия благоприятны',
    },
  };

  const ecoTips = [
    {
      id: '1',
      title: 'Уважайте дикую природу',
      description: 'Не приближайтесь к диким животным ближе чем на 100 метров',
      icon: '🐻',
      category: 'wildlife',
    },
    {
      id: '2',
      title: 'Убирайте за собой',
      description: 'Всегда забирайте мусор с собой, не оставляйте следов',
      icon: '🗑️',
      category: 'waste',
    },
    {
      id: '3',
      title: 'Используйте экотропы',
      description: 'Ходите только по обозначенным тропам',
      icon: '🛤️',
      category: 'trails',
    },
    {
      id: '4',
      title: 'Берегите воду',
      description: 'Не загрязняйте водоемы, используйте биоразлагаемые средства',
      icon: '💧',
      category: 'water',
    },
    {
      id: '5',
      title: 'Огонь только в разрешенных местах',
      description: 'Разводите костры только в специально оборудованных местах',
      icon: '🔥',
      category: 'fire',
    },
    {
      id: '6',
      title: 'Фотографируйте, не трогайте',
      description: 'Делайте снимки растений и животных, не срывайте и не ловите',
      icon: '📸',
      category: 'photography',
    },
  ];

  const categories = [
    { id: 'all', name: 'Все', icon: '🌿' },
    { id: 'wildlife', name: 'Дикая природа', icon: '🐻' },
    { id: 'waste', name: 'Отходы', icon: '🗑️' },
    { id: 'trails', name: 'Тропы', icon: '🛤️' },
    { id: 'water', name: 'Вода', icon: '💧' },
    { id: 'fire', name: 'Огонь', icon: '🔥' },
    { id: 'photography', name: 'Фото', icon: '📸' },
  ];

  const filteredTips = selectedCategory === 'all' 
    ? ecoTips 
    : ecoTips.filter(tip => tip.category === selectedCategory);

  const renderEcoMetric = (key: string, data: any) => (
    <View key={key} style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricTitle}>{key === 'airQuality' ? 'Качество воздуха' : 
                                           key === 'waterQuality' ? 'Качество воды' :
                                           key === 'wildlifeActivity' ? 'Активность животных' : 'Погодные условия'}</Text>
        <View style={[styles.statusBadge, { backgroundColor: data.color }]}>
          <Text style={styles.statusText}>{data.status}</Text>
        </View>
      </View>
      <View style={styles.metricValue}>
        <Text style={styles.valueNumber}>{data.value}</Text>
        <Text style={styles.valueUnit}>{key === 'airQuality' ? 'AQI' : 
                                       key === 'waterQuality' ? 'мг/л' :
                                       key === 'wildlifeActivity' ? '%' : '%'}</Text>
      </View>
      <Text style={styles.metricDescription}>{data.description}</Text>
    </View>
  );

  const renderEcoTip = (tip: any) => (
    <TouchableOpacity key={tip.id} style={styles.tipCard}>
      <View style={styles.tipHeader}>
        <Text style={styles.tipIcon}>{tip.icon}</Text>
        <View style={styles.tipInfo}>
          <Text style={styles.tipTitle}>{tip.title}</Text>
          <Text style={styles.tipDescription}>{tip.description}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.learnMoreButton}
        onPress={() => Alert.alert('Подробнее', tip.description)}
      >
        <Text style={styles.learnMoreText}>Подробнее</Text>
        <Ionicons name="chevron-forward" size={16} color="#0891b2" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Экология Камчатки</Text>
          <Text style={styles.headerSubtitle}>
            Заботьтесь о природе и узнавайте о состоянии окружающей среды
          </Text>
        </View>

        {/* Current Location Info */}
        {location && (
          <View style={styles.locationCard}>
            <Ionicons name="location" size={20} color="#0891b2" />
            <Text style={styles.locationText}>
              {location.address || `Координаты: ${location.coordinates.latitude.toFixed(4)}, ${location.coordinates.longitude.toFixed(4)}`}
            </Text>
          </View>
        )}

        {/* Eco Metrics */}
        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Текущее состояние</Text>
          <View style={styles.metricsGrid}>
            {Object.entries(ecoData).map(([key, data]) => renderEcoMetric(key, data))}
          </View>
        </View>

        {/* Categories Filter */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Категории советов</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryName,
                  selectedCategory === category.id && styles.categoryNameActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Eco Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Экологические советы</Text>
          {filteredTips.map(renderEcoTip)}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Быстрые действия</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="leaf" size={24} color="#0891b2" />
              <Text style={styles.actionText}>Эко-отчет</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="camera" size={24} color="#0891b2" />
              <Text style={styles.actionText}>Фото природы</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="map" size={24} color="#0891b2" />
              <Text style={styles.actionText}>Эко-карта</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="people" size={24} color="#0891b2" />
              <Text style={styles.actionText}>Волонтерство</Text>
            </TouchableOpacity>
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
    backgroundColor: '#10b981',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#d1fae5',
    textAlign: 'center',
  },
  locationCard: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#64748b',
  },
  metricsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: '#ffffff',
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  metricValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  valueNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginRight: 4,
  },
  valueUnit: {
    fontSize: 14,
    color: '#64748b',
  },
  metricDescription: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  categoriesSection: {
    padding: 20,
  },
  categoriesScroll: {
    flexDirection: 'row',
  },
  categoryButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryButtonActive: {
    backgroundColor: '#10b981',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  categoryNameActive: {
    color: '#ffffff',
  },
  tipsSection: {
    padding: 20,
  },
  tipCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tipIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  tipInfo: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  learnMoreText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
    marginRight: 4,
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
});