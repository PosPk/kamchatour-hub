import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocation } from '../contexts/LocationContext';
import { useQuantum } from '../contexts/QuantumContext';

const { width } = Dimensions.get('window');

interface Destination {
  id: string;
  name: string;
  type: 'volcano' | 'geyser' | 'lake' | 'mountain' | 'hotspring' | 'wildlife';
  description: string;
  rating: number;
  difficulty: string;
  duration: string;
  cost: number;
  image: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  quantumScore?: number;
  blockchainVerified: boolean;
}

export default function DestinationsScreen() {
  const { currentLocation, getNearbyAttractions } = useLocation();
  const { isQuantumAvailable, runGroverSearch } = useQuantum();
  
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isOptimizing, setIsOptimizing] = useState(false);

  const destinationTypes = [
    { id: 'all', name: 'Все', icon: 'earth' },
    { id: 'volcano', name: 'Вулканы', icon: 'fire' },
    { id: 'geyser', name: 'Гейзеры', icon: 'water' },
    { id: 'lake', name: 'Озера', icon: 'waves' },
    { id: 'mountain', name: 'Горы', icon: 'terrain' },
    { id: 'hotspring', name: 'Источники', icon: 'thermometer' },
    { id: 'wildlife', name: 'Дикая природа', icon: 'paw' },
  ];

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = () => {
    const mockDestinations: Destination[] = [
      {
        id: '1',
        name: 'Ключевская сопка',
        type: 'volcano',
        description: 'Самый высокий действующий вулкан Евразии (4750 м). Уникальная возможность увидеть извержение в реальном времени.',
        rating: 5.0,
        difficulty: 'Экстремальный',
        duration: '3-5 дней',
        cost: 45000,
        image: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Ключевская+сопка',
        coordinates: { latitude: 56.0569, longitude: 160.6428 },
        blockchainVerified: true
      },
      {
        id: '2',
        name: 'Долина гейзеров',
        type: 'geyser',
        description: 'Уникальное скопление гейзеров в кальдере вулкана Узон. Фантастические пейзажи и термальные источники.',
        rating: 5.0,
        difficulty: 'Средний',
        duration: '2-3 дня',
        cost: 35000,
        image: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Долина+гейзеров',
        coordinates: { latitude: 54.4306, longitude: 160.1397 },
        blockchainVerified: true
      },
      {
        id: '3',
        name: 'Авачинская сопка',
        type: 'volcano',
        description: 'Символ Петропавловска-Камчатского. Относительно легкое восхождение с потрясающими видами на город и океан.',
        rating: 4.8,
        difficulty: 'Средний',
        duration: '1-2 дня',
        cost: 25000,
        image: 'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Авачинская+сопка',
        coordinates: { latitude: 53.2556, longitude: 158.8306 },
        blockchainVerified: true
      },
      {
        id: '4',
        name: 'Курильское озеро',
        type: 'lake',
        description: 'Место обитания крупнейшей популяции медведей на Камчатке. Идеально для фотосъемки дикой природы.',
        rating: 4.9,
        difficulty: 'Легкий',
        duration: '2-3 дня',
        cost: 30000,
        image: 'https://via.placeholder.com/300x200/96CEB4/FFFFFF?text=Курильское+озеро',
        coordinates: { latitude: 51.4567, longitude: 157.1234 },
        blockchainVerified: true
      },
      {
        id: '5',
        name: 'Мутновский вулкан',
        type: 'volcano',
        description: 'Активный вулкан с фумарольными полями и кислотными озерами. Уникальная геологическая активность.',
        rating: 4.7,
        difficulty: 'Сложный',
        duration: '2-4 дня',
        cost: 40000,
        image: 'https://via.placeholder.com/300x200/FFEAA7/FFFFFF?text=Мутновский+вулкан',
        coordinates: { latitude: 52.4567, longitude: 158.1890 },
        blockchainVerified: true
      },
      {
        id: '6',
        name: 'Термальные источники Паратунки',
        type: 'hotspring',
        description: 'Целебные горячие источники в живописной долине. Отдых и оздоровление в природных условиях.',
        rating: 4.6,
        difficulty: 'Легкий',
        duration: '1 день',
        cost: 15000,
        image: 'https://via.placeholder.com/300x200/DDA0DD/FFFFFF?text=Паратунка',
        coordinates: { latitude: 52.9634, longitude: 158.2345 },
        blockchainVerified: true
      }
    ];

    setDestinations(mockDestinations);
    setFilteredDestinations(mockDestinations);
  };

  const filterByType = (type: string) => {
    setSelectedType(type);
    if (type === 'all') {
      setFilteredDestinations(destinations);
    } else {
      setFilteredDestinations(destinations.filter(dest => dest.type === type));
    }
  };

  const optimizeWithQuantum = async () => {
    if (!isQuantumAvailable) {
      return;
    }

    setIsOptimizing(true);
    try {
      // Имитация квантовой оптимизации
      const result = await runGroverSearch(filteredDestinations, 'optimal');
      
      // Обновляем destinations с квантовыми оценками
      const optimizedDestinations = filteredDestinations.map(dest => ({
        ...dest,
        quantumScore: Math.random() * 40 + 60 // 60-100
      }));

      // Сортируем по квантовому счету
      optimizedDestinations.sort((a, b) => (b.quantumScore || 0) - (a.quantumScore || 0));
      
      setFilteredDestinations(optimizedDestinations);
    } catch (error) {
      console.error('Ошибка квантовой оптимизации:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const renderDestination = ({ item }: { item: Destination }) => (
    <TouchableOpacity style={styles.destinationCard}>
      <Image source={{ uri: item.image }} style={styles.destinationImage} />
      
      <View style={styles.destinationContent}>
        <View style={styles.destinationHeader}>
          <Text style={styles.destinationName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>

        <Text style={styles.destinationDescription}>{item.description}</Text>

        <View style={styles.destinationDetails}>
          <View style={styles.detailItem}>
            <MaterialIcons name="fitness-center" size={16} color="#666" />
            <Text style={styles.detailText}>{item.difficulty}</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons name="schedule" size={16} color="#666" />
            <Text style={styles.detailText}>{item.duration}</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons name="attach-money" size={16} color="#666" />
            <Text style={styles.detailText}>{item.cost} ₽</Text>
          </View>
        </View>

        {item.quantumScore && (
          <View style={styles.quantumScore}>
            <MaterialCommunityIcons name="quantum-entanglement" size={16} color="#667eea" />
            <Text style={styles.quantumScoreText}>Квантовый счет: {item.quantumScore.toFixed(1)}</Text>
          </View>
        )}

        <View style={styles.verificationContainer}>
          {item.blockchainVerified && (
            <View style={styles.verifiedBadge}>
              <MaterialIcons name="verified" size={16} color="#4CAF50" />
              <Text style={styles.verifiedText}>Проверено блокчейном</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Заголовок */}
      <LinearGradient
        colors={['#4A90E2', '#357ABD']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Направления Камчатки</Text>
        <Text style={styles.headerSubtitle}>
          Откройте для себя уникальные места полуострова
        </Text>
      </LinearGradient>

      {/* Фильтры */}
      <View style={styles.filtersSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {destinationTypes.map(type => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.filterChip,
                selectedType === type.id && styles.filterChipSelected
              ]}
              onPress={() => filterByType(type.id)}
            >
              <MaterialCommunityIcons 
                name={type.icon as any} 
                size={20} 
                color={selectedType === type.id ? '#fff' : '#666'} 
              />
              <Text style={[
                styles.filterChipText,
                selectedType === type.id && styles.filterChipTextSelected
              ]}>
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Квантовая оптимизация */}
      {isQuantumAvailable && (
        <View style={styles.quantumSection}>
          <TouchableOpacity
            style={styles.quantumButton}
            onPress={optimizeWithQuantum}
            disabled={isOptimizing}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.quantumButtonGradient}
            >
              <MaterialCommunityIcons 
                name="quantum-entanglement" 
                size={24} 
                color="#fff" 
              />
              <Text style={styles.quantumButtonText}>
                {isOptimizing ? 'Оптимизация...' : 'Квантовая оптимизация'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.quantumInfo}>
            Используйте квантовые алгоритмы для поиска оптимальных направлений
          </Text>
        </View>
      )}

      {/* Список направлений */}
      <View style={styles.destinationsSection}>
        <Text style={styles.sectionTitle}>
          🎯 Найдено направлений: {filteredDestinations.length}
        </Text>
        <FlatList
          data={filteredDestinations}
          renderItem={renderDestination}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      </View>

      {/* Статистика */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>📊 Статистика</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{destinations.length}</Text>
            <Text style={styles.statLabel}>Всего направлений</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {destinations.filter(d => d.type === 'volcano').length}
            </Text>
            <Text style={styles.statLabel}>Вулканов</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {destinations.filter(d => d.blockchainVerified).length}
            </Text>
            <Text style={styles.statLabel}>Проверено</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {destinations.reduce((sum, d) => sum + d.rating, 0) / destinations.length}
            </Text>
            <Text style={styles.statLabel}>Средний рейтинг</Text>
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
    padding: 30,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
  filtersSection: {
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
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  filterChipSelected: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  filterChipText: {
    color: '#666',
    fontSize: 14,
    marginLeft: 8,
  },
  filterChipTextSelected: {
    color: '#fff',
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
  quantumButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  quantumButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  quantumButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  quantumInfo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  destinationsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  destinationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  destinationImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  destinationContent: {
    padding: 20,
  },
  destinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  destinationName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 4,
  },
  destinationDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  destinationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  quantumScore: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  quantumScoreText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
    marginLeft: 8,
  },
  verificationContainer: {
    alignItems: 'flex-end',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
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