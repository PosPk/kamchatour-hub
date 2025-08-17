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
import { KamchaEcoToken, KAMCHA_TOKEN_CONFIG, EcoAction } from '../features/ecoToken';

const { width } = Dimensions.get('window');

interface TokenBalance {
  kamcha: number;
  ecoScore: number;
  level: number;
  achievements: string[];
  stakedAmount: number;
  stakingRewards: number;
}

export default function EcoTokenScreen() {
  const { isBlockchainConnected, createSmartContract, executeTransaction } = useQuantum();
  
  const [tokenBalance, setTokenBalance] = useState<TokenBalance>({
    kamcha: 0,
    ecoScore: 0,
    level: 1,
    achievements: [],
    stakedAmount: 0,
    stakingRewards: 0
  });
  
  const [ecoActions, setEcoActions] = useState<EcoAction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  useEffect(() => {
    loadTokenData();
    loadEcoActions();
  }, []);

  const loadTokenData = () => {
    // Имитация загрузки данных токена
    setTokenBalance({
      kamcha: 1250,
      ecoScore: 450,
      level: 4,
      achievements: ['🌱 Эко-новичок', '🌿 Защитник природы', '🌳 Хранитель леса'],
      stakedAmount: 500,
      stakingRewards: 25
    });
  };

  const loadEcoActions = () => {
    const mockActions: EcoAction[] = [
      {
        id: '1',
        type: 'VOLCANO_CLEANUP',
        name: 'Уборка вулкана',
        description: 'Уборка мусора на склонах вулканов',
        points: 50,
        location: { latitude: 56.0569, longitude: 160.6428, name: 'Ключевская сопка' },
        timestamp: Date.now() - 86400000, // 1 день назад
        proof: 'ipfs://QmHash1',
        verified: true
      },
      {
        id: '2',
        type: 'BEACH_CLEANUP',
        name: 'Уборка пляжа',
        description: 'Очистка пляжей от пластика и мусора',
        points: 30,
        location: { latitude: 53.2556, longitude: 158.8306, name: 'Авачинский залив' },
        timestamp: Date.now() - 172800000, // 2 дня назад
        proof: 'ipfs://QmHash2',
        verified: true
      },
      {
        id: '3',
        type: 'TREE_PLANTING',
        name: 'Посадка деревьев',
        description: 'Посадка саженцев для восстановления лесов',
        points: 40,
        location: { latitude: 52.9634, longitude: 158.2345, name: 'Паратунка' },
        timestamp: Date.now() - 259200000, // 3 дня назад
        proof: 'ipfs://QmHash3',
        verified: false
      }
    ];

    setEcoActions(mockActions);
  };

  const performEcoAction = async (actionType: keyof typeof KAMCHA_TOKEN_CONFIG.ecoActions) => {
    if (!isBlockchainConnected) {
      Alert.alert('Ошибка', 'Блокчейн не подключен');
      return;
    }

    setIsProcessing(true);
    try {
      // Создаем эко-действие
      const action = new KamchaEcoToken('0x1234...5678', {} as any).createEcoAction(
        actionType,
        { latitude: 56.0569, longitude: 160.6428, name: 'Ключевская сопка' },
        `proof_${Date.now()}`
      );

      // Добавляем в список
      setEcoActions(prev => [action, ...prev]);

      // Обновляем баланс
      const points = KAMCHA_TOKEN_CONFIG.ecoActions[actionType];
      const tokens = points * KAMCHA_TOKEN_CONFIG.ecoScoreMultiplier;
      
      setTokenBalance(prev => ({
        ...prev,
        ecoScore: prev.ecoScore + points,
        kamcha: prev.kamcha + tokens
      }));

      // Проверяем повышение уровня
      const newLevel = Math.floor((tokenBalance.ecoScore + points) / 100) + 1;
      if (newLevel > tokenBalance.level) {
        setTokenBalance(prev => ({ ...prev, level: newLevel }));
        Alert.alert('🎉 Новый уровень!', `Поздравляем! Вы достигли ${newLevel} уровня!`);
      }

      Alert.alert(
        '✅ Эко-действие выполнено!',
        `Начислено ${points} эко-баллов и ${tokens} KAMCHA токенов!`
      );

    } catch (error) {
      console.error('Ошибка выполнения эко-действия:', error);
      Alert.alert('Ошибка', 'Не удалось выполнить эко-действие');
    } finally {
      setIsProcessing(false);
    }
  };

  const stakeTokens = async (amount: number) => {
    if (!isBlockchainConnected) {
      Alert.alert('Ошибка', 'Блокчейн не подключен');
      return;
    }

    if (amount > tokenBalance.kamcha) {
      Alert.alert('Ошибка', 'Недостаточно токенов для стейкинга');
      return;
    }

    setIsProcessing(true);
    try {
      // Имитация стейкинга
      await new Promise(resolve => setTimeout(resolve, 2000));

      setTokenBalance(prev => ({
        ...prev,
        kamcha: prev.kamcha - amount,
        stakedAmount: prev.stakedAmount + amount
      }));

      Alert.alert('✅ Токены застейканы!', `Застейкано ${amount} KAMCHA токенов`);

    } catch (error) {
      console.error('Ошибка стейкинга:', error);
      Alert.alert('Ошибка', 'Не удалось застейкать токены');
    } finally {
      setIsProcessing(false);
    }
  };

  const claimRewards = async () => {
    if (tokenBalance.stakingRewards <= 0) {
      Alert.alert('Информация', 'Нет наград для получения');
      return;
    }

    setIsProcessing(true);
    try {
      // Имитация получения наград
      await new Promise(resolve => setTimeout(resolve, 1500));

      setTokenBalance(prev => ({
        ...prev,
        kamcha: prev.kamcha + prev.stakingRewards,
        stakingRewards: 0
      }));

      Alert.alert('✅ Награды получены!', `Получено ${tokenBalance.stakingRewards} KAMCHA токенов`);

    } catch (error) {
      console.error('Ошибка получения наград:', error);
      Alert.alert('Ошибка', 'Не удалось получить награды');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderEcoAction = ({ item }: { item: EcoAction }) => (
    <View style={styles.actionCard}>
      <View style={styles.actionHeader}>
        <Text style={styles.actionName}>{item.name}</Text>
        <View style={styles.actionPoints}>
          <Text style={styles.pointsText}>+{item.points}</Text>
        </View>
      </View>
      
      <Text style={styles.actionDescription}>{item.description}</Text>
      
      <View style={styles.actionDetails}>
        <View style={styles.detailItem}>
          <MaterialIcons name="location-on" size={16} color="#666" />
          <Text style={styles.detailText}>{item.location.name}</Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialIcons name="schedule" size={16} color="#666" />
          <Text style={styles.detailText}>
            {new Date(item.timestamp).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons 
            name={item.verified ? "check-circle" : "clock"} 
            size={16} 
            color={item.verified ? "#4CAF50" : "#FF9800"} 
          />
          <Text style={styles.detailText}>
            {item.verified ? 'Верифицировано' : 'На проверке'}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderAchievement = ({ item }: { item: string }) => (
    <View style={styles.achievementChip}>
      <Text style={styles.achievementText}>{item}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Заголовок */}
      <LinearGradient
        colors={['#4CAF50', '#45B7D1']}
        style={styles.header}
      >
        <MaterialCommunityIcons name="leaf" size={40} color="#fff" />
        <Text style={styles.headerTitle}>KAMCHA Эко-токены</Text>
        <Text style={styles.headerSubtitle}>
          Зарабатывайте токены за экологические действия
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

      {/* Баланс токенов */}
      <View style={styles.balanceSection}>
        <Text style={styles.sectionTitle}>💰 Баланс токенов</Text>
        
        <View style={styles.balanceGrid}>
          <View style={styles.balanceCard}>
            <MaterialCommunityIcons name="currency-btc" size={32} color="#4CAF50" />
            <Text style={styles.balanceAmount}>{tokenBalance.kamcha}</Text>
            <Text style={styles.balanceLabel}>KAMCHA</Text>
          </View>
          
          <View style={styles.balanceCard}>
            <MaterialCommunityIcons name="leaf" size={32} color="#45B7D1" />
            <Text style={styles.balanceAmount}>{tokenBalance.ecoScore}</Text>
            <Text style={styles.balanceLabel}>Эко-баллы</Text>
          </View>
          
          <View style={styles.balanceCard}>
            <MaterialCommunityIcons name="star" size={32} color="#FFD700" />
            <Text style={styles.balanceAmount}>{tokenBalance.level}</Text>
            <Text style={styles.balanceLabel}>Уровень</Text>
          </View>
          
          <View style={styles.balanceCard}>
            <MaterialCommunityIcons name="lock" size={32} color="#FF9800" />
            <Text style={styles.balanceAmount}>{tokenBalance.stakedAmount}</Text>
            <Text style={styles.balanceLabel}>Застейкано</Text>
          </View>
        </View>
      </View>

      {/* Достижения */}
      <View style={styles.achievementsSection}>
        <Text style={styles.sectionTitle}>🏆 Достижения</Text>
        <FlatList
          data={tokenBalance.achievements}
          renderItem={renderAchievement}
          keyExtractor={item => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
        />
      </View>

      {/* Стейкинг */}
      <View style={styles.stakingSection}>
        <Text style={styles.sectionTitle}>🔒 Стейкинг токенов</Text>
        
        <View style={styles.stakingInfo}>
          <Text style={styles.stakingText}>
            Застейкано: {tokenBalance.stakedAmount} KAMCHA
          </Text>
          <Text style={styles.stakingText}>
            Награды: {tokenBalance.stakingRewards} KAMCHA
          </Text>
          <Text style={styles.stakingText}>
            APY: {KAMCHA_TOKEN_CONFIG.stakingRewards * 100}%
          </Text>
        </View>
        
        <View style={styles.stakingButtons}>
          <TouchableOpacity
            style={styles.stakeButton}
            onPress={() => stakeTokens(100)}
            disabled={isProcessing || tokenBalance.kamcha < 100}
          >
            <LinearGradient
              colors={['#4CAF50', '#45B7D1']}
              style={styles.stakeButtonGradient}
            >
              <Text style={styles.stakeButtonText}>Застейкать 100 KAMCHA</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.claimButton}
            onPress={claimRewards}
            disabled={isProcessing || tokenBalance.stakingRewards <= 0}
          >
            <LinearGradient
              colors={['#FF9800', '#FF5722']}
              style={styles.claimButtonGradient}
            >
              <Text style={styles.claimButtonText}>Получить награды</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Доступные эко-действия */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>🌱 Доступные эко-действия</Text>
        <Text style={styles.sectionSubtitle}>
          Выполняйте действия и получайте токены
        </Text>
        
        <View style={styles.actionsGrid}>
          {Object.entries(KAMCHA_TOKEN_CONFIG.ecoActions).map(([actionType, points]) => (
            <TouchableOpacity
              key={actionType}
              style={styles.actionButton}
              onPress={() => performEcoAction(actionType as any)}
              disabled={isProcessing}
            >
              <LinearGradient
                colors={['#4CAF50', '#45B7D1']}
                style={styles.actionButtonGradient}
              >
                <Text style={styles.actionButtonText}>
                  {actionType.replace(/_/g, ' ')}
                </Text>
                <Text style={styles.actionButtonPoints}>+{points} баллов</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* История эко-действий */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>📋 История эко-действий</Text>
        <FlatList
          data={ecoActions}
          renderItem={renderEcoAction}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      </View>

      {/* Информация о токене */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>ℹ️ О токене KAMCHA</Text>
        <View style={styles.tokenInfo}>
          <Text style={styles.tokenInfoItem}>• <Text style={styles.tokenInfoBold}>Название:</Text> {KAMCHA_TOKEN_CONFIG.name}</Text>
          <Text style={styles.tokenInfoItem}>• <Text style={styles.tokenInfoBold}>Символ:</Text> {KAMCHA_TOKEN_CONFIG.symbol}</Text>
          <Text style={styles.tokenInfoItem}>• <Text style={styles.tokenInfoBold}>Общий объем:</Text> 1,000,000 KAMCHA</Text>
          <Text style={styles.tokenInfoItem}>• <Text style={styles.tokenInfoBold}>Множитель:</Text> 1 эко-балл = {KAMCHA_TOKEN_CONFIG.ecoScoreMultiplier} KAMCHA</Text>
          <Text style={styles.tokenInfoItem}>• <Text style={styles.tokenInfoBold}>Стейкинг:</Text> {KAMCHA_TOKEN_CONFIG.stakingRewards * 100}% годовых</Text>
          <Text style={styles.tokenInfoItem}>• <Text style={styles.tokenInfoBold}>Сжигание:</Text> {KAMCHA_TOKEN_CONFIG.burnRate / 100}% при каждой транзакции</Text>
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
  balanceSection: {
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  balanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  balanceCard: {
    width: (width - 80) / 2,
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 8,
    marginBottom: 4,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  achievementsSection: {
    padding: 20,
  },
  achievementChip: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  achievementText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  stakingSection: {
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
  stakingInfo: {
    marginBottom: 20,
  },
  stakingText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  stakingButtons: {
    gap: 12,
  },
  stakeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  stakeButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  stakeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  claimButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  claimButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  claimButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionsSection: {
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
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  actionsGrid: {
    gap: 12,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionButtonPoints: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  historySection: {
    padding: 20,
  },
  actionCard: {
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
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  actionPoints: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pointsText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  actionDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  actionDetails: {
    gap: 8,
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
  tokenInfo: {
    gap: 8,
  },
  tokenInfoItem: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  tokenInfoBold: {
    fontWeight: 'bold',
    color: '#333',
  },
});