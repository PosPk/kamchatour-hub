import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuantum } from '../contexts/QuantumContext';

const { width } = Dimensions.get('window');

interface InsurancePolicy {
  id: string;
  name: string;
  type: 'basic' | 'premium' | 'extreme' | 'family';
  description: string;
  coverage: string[];
  price: number;
  duration: string;
  quantumScore?: number;
  blockchainContract: string;
  isActive: boolean;
}

interface InsuranceProvider {
  id: string;
  name: string;
  logo: string;
  rating: number;
  policiesCount: number;
  blockchainVerified: boolean;
}

export default function InsuranceScreen() {
  const { isBlockchainConnected, createSmartContract, executeTransaction } = useQuantum();
  
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [providers, setProviders] = useState<InsuranceProvider[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<InsurancePolicy | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadInsuranceData();
  }, []);

  const loadInsuranceData = () => {
    const mockProviders: InsuranceProvider[] = [
      {
        id: '1',
        name: 'Ingosstrakh',
        logo: 'https://via.placeholder.com/80x80/4A90E2/FFFFFF?text=И',
        rating: 4.8,
        policiesCount: 1250,
        blockchainVerified: true
      },
      {
        id: '2',
        name: 'Rosgosstrakh',
        logo: 'https://via.placeholder.com/80x80/FF6B6B/FFFFFF?text=Р',
        rating: 4.6,
        policiesCount: 980,
        blockchainVerified: true
      },
      {
        id: '3',
        name: 'SOGAZ',
        logo: 'https://via.placeholder.com/80x80/4ECDC4/FFFFFF?text=С',
        rating: 4.7,
        policiesCount: 1100,
        blockchainVerified: true
      },
      {
        id: '4',
        name: 'Kamchatka-Strakh',
        logo: 'https://via.placeholder.com/80x80/FFEAA7/FFFFFF?text=К',
        rating: 4.9,
        policiesCount: 750,
        blockchainVerified: true
      }
    ];

    const mockPolicies: InsurancePolicy[] = [
      {
        id: '1',
        name: 'Базовое страхование',
        type: 'basic',
        description: 'Стандартная защита для безопасных туристических маршрутов',
        coverage: [
          'Медицинские расходы до 100,000 ₽',
          'Эвакуация до 200,000 ₽',
          'Отмена поездки до 50,000 ₽',
          'Потеря багажа до 30,000 ₽'
        ],
        price: 1500,
        duration: '30 дней',
        blockchainContract: '0x1234...5678',
        isActive: false
      },
      {
        id: '2',
        name: 'Премиум защита',
        type: 'premium',
        description: 'Расширенное покрытие для активного туризма',
        coverage: [
          'Медицинские расходы до 500,000 ₽',
          'Эвакуация до 1,000,000 ₽',
          'Отмена поездки до 200,000 ₽',
          'Потеря багажа до 100,000 ₽',
          'Спортивные травмы',
          'Экстремальные виды спорта'
        ],
        price: 3500,
        duration: '30 дней',
        blockchainContract: '0x8765...4321',
        isActive: false
      },
      {
        id: '3',
        name: 'Экстремальное страхование',
        type: 'extreme',
        description: 'Максимальная защита для экстремальных маршрутов',
        coverage: [
          'Медицинские расходы до 2,000,000 ₽',
          'Эвакуация до 5,000,000 ₽',
          'Отмена поездки до 500,000 ₽',
          'Потеря багажа до 200,000 ₽',
          'Восхождение на вулканы',
          'Вертолетные туры',
          'Спасательные операции'
        ],
        price: 7500,
        duration: '30 дней',
        blockchainContract: '0xabcd...efgh',
        isActive: false
      },
      {
        id: '4',
        name: 'Семейный пакет',
        type: 'family',
        description: 'Защита для всей семьи с детьми',
        coverage: [
          'Медицинские расходы до 300,000 ₽ на человека',
          'Эвакуация до 500,000 ₽ на человека',
          'Отмена поездки до 150,000 ₽',
          'Потеря багажа до 50,000 ₽ на человека',
          'Детские травмы',
          'Семейные мероприятия'
        ],
        price: 4500,
        duration: '30 дней',
        blockchainContract: '0xdcba...hgfe',
        isActive: false
      }
    ];

    setProviders(mockProviders);
    setPolicies(mockPolicies);
  };

  const selectPolicy = (policy: InsurancePolicy) => {
    setSelectedPolicy(policy);
  };

  const purchaseInsurance = async (policy: InsurancePolicy) => {
    if (!isBlockchainConnected) {
      Alert.alert('Ошибка', 'Блокчейн не подключен');
      return;
    }

    setIsProcessing(true);
    try {
      // Создаем смарт-контракт страхования
      const contract = await createSmartContract('insurance', {
        policyId: policy.id,
        type: policy.type,
        price: policy.price,
        duration: policy.duration
      });

      // Выполняем транзакцию
      const transaction = await executeTransaction(
        'user_wallet',
        contract.address,
        policy.price / 1000 // Конвертируем в ETH
      );

      // Активируем полис
      setPolicies(prev => prev.map(p => 
        p.id === policy.id ? { ...p, isActive: true } : p
      ));

      Alert.alert(
        'Страхование оформлено!',
        `Полис "${policy.name}" активирован!\n\nКонтракт: ${contract.address}\nТранзакция: ${transaction.hash}`,
        [{ text: 'Отлично!', style: 'default' }]
      );

    } catch (error) {
      console.error('Ошибка покупки страхования:', error);
      Alert.alert('Ошибка', 'Не удалось оформить страхование');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPolicy = ({ item }: { item: InsurancePolicy }) => (
    <TouchableOpacity
      style={[
        styles.policyCard,
        selectedPolicy?.id === item.id && styles.policyCardSelected,
        item.isActive && styles.policyCardActive
      ]}
      onPress={() => selectPolicy(item)}
    >
      <View style={styles.policyHeader}>
        <Text style={styles.policyName}>{item.name}</Text>
        <View style={styles.policyType}>
          <Text style={styles.policyTypeText}>{item.type}</Text>
        </View>
      </View>

      <Text style={styles.policyDescription}>{item.description}</Text>

      <View style={styles.policyDetails}>
        <View style={styles.detailItem}>
          <MaterialIcons name="attach-money" size={16} color="#666" />
          <Text style={styles.detailText}>{item.price} ₽</Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialIcons name="schedule" size={16} color="#666" />
          <Text style={styles.detailText}>{item.duration}</Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="blockchain" size={16} color="#667eea" />
          <Text style={styles.detailText}>Блокчейн</Text>
        </View>
      </View>

      <View style={styles.coverageSection}>
        <Text style={styles.coverageTitle}>Покрытие:</Text>
        {item.coverage.map((coverage, index) => (
          <Text key={index} style={styles.coverageItem}>• {coverage}</Text>
        ))}
      </View>

      {item.quantumScore && (
        <View style={styles.quantumScore}>
          <MaterialCommunityIcons name="quantum-entanglement" size={16} color="#667eea" />
          <Text style={styles.quantumScoreText}>
            Квантовая оценка риска: {item.quantumScore.toFixed(1)}
          </Text>
        </View>
      )}

      {item.isActive && (
        <View style={styles.activeBadge}>
          <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
          <Text style={styles.activeText}>Активен</Text>
        </View>
      )}

      {selectedPolicy?.id === item.id && !item.isActive && (
        <TouchableOpacity
          style={styles.purchaseButton}
          onPress={() => purchaseInsurance(item)}
          disabled={isProcessing}
        >
          <LinearGradient
            colors={['#4CAF50', '#45B7D1']}
            style={styles.purchaseButtonGradient}
          >
            <Text style={styles.purchaseButtonText}>
              {isProcessing ? 'Обработка...' : 'Оформить страхование'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const renderProvider = ({ item }: { item: InsuranceProvider }) => (
    <View style={styles.providerCard}>
      <Image source={{ uri: item.logo }} style={styles.providerLogo} />
      <View style={styles.providerInfo}>
        <Text style={styles.providerName}>{item.name}</Text>
        <View style={styles.providerRating}>
          <MaterialIcons name="star" size={16} color="#FFD700" />
          <Text style={styles.providerRatingText}>{item.rating}</Text>
        </View>
        <Text style={styles.providerPolicies}>{item.policiesCount} полисов</Text>
        {item.blockchainVerified && (
          <View style={styles.verifiedBadge}>
            <MaterialIcons name="verified" size={14} color="#4CAF50" />
            <Text style={styles.verifiedText}>Проверено</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Заголовок */}
      <LinearGradient
        colors={['#4A90E2', '#357ABD']}
        style={styles.header}
      >
        <MaterialIcons name="security" size={40} color="#fff" />
        <Text style={styles.headerTitle}>Страхование путешествий</Text>
        <Text style={styles.headerSubtitle}>
          Блокчейн-защита для безопасных приключений
        </Text>
      </LinearGradient>

      {/* Статус блокчейна */}
      <View style={styles.blockchainStatus}>
        <MaterialCommunityIcons 
          name={isBlockchainConnected ? "check-circle" : "close-circle"} 
          size={24} 
          color={isBlockchainConnected ? "#4CAF50" : "#F44336"} 
        />
        <Text style={styles.blockchainStatusText}>
          Блокчейн: {isBlockchainConnected ? 'Подключен' : 'Отключен'}
        </Text>
      </View>

      {/* Страховые компании */}
      <View style={styles.providersSection}>
        <Text style={styles.sectionTitle}>🏢 Страховые компании</Text>
        <FlatList
          data={providers}
          renderItem={renderProvider}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
        />
      </View>

      {/* Страховые полисы */}
      <View style={styles.policiesSection}>
        <Text style={styles.sectionTitle}>📋 Страховые полисы</Text>
        <Text style={styles.sectionSubtitle}>
          Выберите подходящий полис для вашего путешествия
        </Text>
        <FlatList
          data={policies}
          renderItem={renderPolicy}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      </View>

      {/* Информация о блокчейн-страховании */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>🔗 Преимущества блокчейн-страхования</Text>
        <View style={styles.advantagesList}>
          <Text style={styles.advantageItem}>• <Text style={styles.advantageBold}>Прозрачность</Text> - все условия записаны в смарт-контракте</Text>
          <Text style={styles.advantageItem}>• <Text style={styles.advantageBold}>Автоматизация</Text> - выплаты происходят автоматически</Text>
          <Text style={styles.advantageItem}>• <Text style={styles.advantageBold}>Безопасность</Text> - защита от мошенничества</Text>
          <Text style={styles.advantageItem}>• <Text style={styles.advantageBold}>Скорость</Text> - мгновенная обработка заявок</Text>
          <Text style={styles.advantageItem}>• <Text style={styles.advantageBold}>Неизменяемость</Text> - условия нельзя изменить задним числом</Text>
        </View>
      </View>

      {/* Статистика */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>📊 Статистика страхования</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{policies.length}</Text>
            <Text style={styles.statLabel}>Доступных полисов</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {policies.filter(p => p.isActive).length}
            </Text>
            <Text style={styles.statLabel}>Активных полисов</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{providers.length}</Text>
            <Text style={styles.statLabel}>Страховых компаний</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {providers.filter(p => p.blockchainVerified).length}
            </Text>
            <Text style={styles.statLabel}>Проверено блокчейном</Text>
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
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
  blockchainStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    margin: 20,
    padding: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  blockchainStatusText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  providersSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginRight: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minWidth: 200,
  },
  providerLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  providerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  providerRatingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  providerPolicies: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 10,
    color: '#4CAF50',
    marginLeft: 2,
  },
  policiesSection: {
    padding: 20,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  policyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  policyCardSelected: {
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  policyCardActive: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  policyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  policyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  policyType: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  policyTypeText: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  policyDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  policyDetails: {
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
  coverageSection: {
    marginBottom: 16,
  },
  coverageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  coverageItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
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
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  activeText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
  },
  purchaseButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  purchaseButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoSection: {
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
  advantagesList: {
    gap: 8,
  },
  advantageItem: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  advantageBold: {
    fontWeight: 'bold',
    color: '#333',
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