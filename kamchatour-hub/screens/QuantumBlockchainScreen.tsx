import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuantum } from '../contexts/QuantumContext';

const { width } = Dimensions.get('window');

interface AlgorithmResult {
  id: string;
  name: string;
  quantumScore: number;
  classicalScore: number;
  improvement: number;
  executionTime: number;
  energyEfficiency: number;
  status: 'pending' | 'running' | 'completed' | 'error';
}

export default function QuantumBlockchainScreen() {
  const {
    quantumState,
    isQuantumAvailable,
    blockchainTransactions,
    smartContracts,
    isBlockchainConnected,
    runGroverSearch,
    runQuantumAnnealing,
    runVQE,
    runQuantumMachineLearning,
    createSmartContract,
    executeTransaction,
    getContractBalance,
    createQuantumProof,
    verifyQuantumSignature,
    quantumConsensus,
    getSystemStatus
  } = useQuantum();

  const [results, setResults] = useState<AlgorithmResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [systemStatus, setSystemStatus] = useState<any>(null);

  useEffect(() => {
    loadSystemStatus();
  }, []);

  const loadSystemStatus = async () => {
    try {
      const status = await getSystemStatus();
      setSystemStatus(status);
    } catch (error) {
      console.error('Ошибка загрузки статуса:', error);
    }
  };

  const runAlgorithm = async (algorithm: string, data: any) => {
    if (!isQuantumAvailable) {
      Alert.alert('Ошибка', 'Квантовая система недоступна');
      return;
    }

    setIsRunning(true);
    const resultId = `${algorithm}_${Date.now()}`;
    
    // Добавляем результат в состояние
    const newResult: AlgorithmResult = {
      id: resultId,
      name: algorithm,
      quantumScore: 0,
      classicalScore: 0,
      improvement: 0,
      executionTime: 0,
      energyEfficiency: 0,
      status: 'running'
    };

    setResults(prev => [...prev, newResult]);

    try {
      let result;
      switch (algorithm) {
        case 'Grover Search':
          result = await runGroverSearch(data, 'target');
          break;
        case 'Quantum Annealing':
          result = await runQuantumAnnealing(data);
          break;
        case 'VQE':
          result = await runVQE(data);
          break;
        case 'Quantum ML':
          result = await runQuantumMachineLearning(data);
          break;
        default:
          throw new Error('Неизвестный алгоритм');
      }

      // Обновляем результат
      setResults(prev => prev.map(r => 
        r.id === resultId 
          ? {
              ...r,
              quantumScore: result.quantumScore,
              classicalScore: result.classicalScore,
              improvement: result.improvement,
              executionTime: result.executionTime,
              energyEfficiency: result.energyEfficiency,
              status: 'completed'
            }
          : r
      ));

    } catch (error) {
      console.error(`Ошибка выполнения ${algorithm}:`, error);
      setResults(prev => prev.map(r => 
        r.id === resultId ? { ...r, status: 'error' } : r
      ));
      Alert.alert('Ошибка', `Не удалось выполнить ${algorithm}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCreateContract = async () => {
    try {
      const contract = await createSmartContract('test', { name: 'Test Contract' });
      Alert.alert('Успех', `Контракт создан: ${contract.address}`);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось создать контракт');
    }
  };

  const handleExecuteTransaction = async () => {
    try {
      const transaction = await executeTransaction(
        '0x1234...5678',
        '0x8765...4321',
        0.1
      );
      Alert.alert('Успех', `Транзакция выполнена: ${transaction.hash}`);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось выполнить транзакцию');
    }
  };

  const handleCreateQuantumProof = async () => {
    try {
      const proof = await createQuantumProof({ data: 'test data' });
      Alert.alert('Успех', `Квантовое доказательство создано: ${proof}`);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось создать квантовое доказательство');
    }
  };

  const handleQuantumConsensus = async () => {
    try {
      const consensus = await quantumConsensus(
        ['0x1234...5678', '0x8765...4321', '0xabcd...efgh'],
        { proposal: 'test proposal' }
      );
      Alert.alert('Результат', `Консенсус: ${consensus ? 'Достигнут' : 'Не достигнут'}`);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось достичь консенсуса');
    }
  };

  const renderAlgorithmResult = ({ item }: { item: AlgorithmResult }) => (
    <View style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultName}>{item.name}</Text>
        <View style={[
          styles.statusIndicator,
          { backgroundColor: item.status === 'completed' ? '#4CAF50' : 
                          item.status === 'running' ? '#FF9800' : 
                          item.status === 'error' ? '#F44336' : '#9E9E9E' }
        ]} />
      </View>
      
      {item.status === 'completed' && (
        <View style={styles.resultDetails}>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Квантовый счет:</Text>
            <Text style={styles.resultValue}>{item.quantumScore.toFixed(1)}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Классический счет:</Text>
            <Text style={styles.resultValue}>{item.classicalScore.toFixed(1)}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Улучшение:</Text>
            <Text style={[styles.resultValue, { color: '#4CAF50' }]}>
              +{item.improvement.toFixed(1)}%
            </Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Время выполнения:</Text>
            <Text style={styles.resultValue}>{item.executionTime}ms</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Энергоэффективность:</Text>
            <Text style={styles.resultValue}>{(item.energyEfficiency * 100).toFixed(0)}%</Text>
          </View>
        </View>
      )}
      
      {item.status === 'running' && (
        <View style={styles.runningIndicator}>
          <ActivityIndicator size="small" color="#FF9800" />
          <Text style={styles.runningText}>Выполняется...</Text>
        </View>
      )}
      
      {item.status === 'error' && (
        <Text style={styles.errorText}>Ошибка выполнения</Text>
      )}
    </View>
  );

  const renderSmartContract = ({ item }: { item: any }) => (
    <View style={styles.contractCard}>
      <View style={styles.contractHeader}>
        <Text style={styles.contractName}>{item.name}</Text>
        <Text style={styles.contractType}>{item.type}</Text>
      </View>
      <Text style={styles.contractAddress}>Адрес: {item.address}</Text>
      <View style={styles.contractStats}>
        <Text style={styles.contractStat}>Транзакции: {item.totalTransactions}</Text>
        <Text style={styles.contractStat}>Значение: {item.totalValue} ETH</Text>
      </View>
    </View>
  );

  const renderTransaction = ({ item }: { item: any }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <Text style={styles.transactionHash}>{item.hash.substring(0, 20)}...</Text>
        <Text style={styles.transactionAmount}>{item.amount} ETH</Text>
      </View>
      <Text style={styles.transactionFrom}>От: {item.from}</Text>
      <Text style={styles.transactionTo}>К: {item.to}</Text>
      <Text style={styles.transactionTime}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Заголовок */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <MaterialCommunityIcons name="quantum-entanglement" size={40} color="#fff" />
        <Text style={styles.headerTitle}>Квантово-блокчейн система</Text>
        <Text style={styles.headerSubtitle}>
          Передовые технологии для туризма будущего
        </Text>
      </LinearGradient>

      {/* Статус системы */}
      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>🔧 Статус системы</Text>
        <View style={styles.statusGrid}>
          <View style={styles.statusCard}>
            <MaterialCommunityIcons 
              name={isQuantumAvailable ? "check-circle" : "close-circle"} 
              size={24} 
              color={isQuantumAvailable ? "#4CAF50" : "#F44336"} 
            />
            <Text style={styles.statusLabel}>Квантовая система</Text>
            <Text style={styles.statusValue}>
              {isQuantumAvailable ? 'Активна' : 'Неактивна'}
            </Text>
          </View>
          
          <View style={styles.statusCard}>
            <MaterialCommunityIcons 
              name={isBlockchainConnected ? "check-circle" : "close-circle"} 
              size={24} 
              color={isBlockchainConnected ? "#4CAF50" : "#F44336"} 
            />
            <Text style={styles.statusLabel}>Блокчейн</Text>
            <Text style={styles.statusValue}>
              {isBlockchainConnected ? 'Подключен' : 'Отключен'}
            </Text>
          </View>
          
          <View style={styles.statusCard}>
            <MaterialCommunityIcons name="memory" size={24} color="#2196F3" />
            <Text style={styles.statusLabel}>Кубиты</Text>
            <Text style={styles.statusValue}>{quantumState.qubits}</Text>
          </View>
          
          <View style={styles.statusCard}>
            <MaterialCommunityIcons name="flash" size={24} color="#FF9800" />
            <Text style={styles.statusLabel}>Когерентность</Text>
            <Text style={styles.statusValue}>{(quantumState.coherence * 100).toFixed(0)}%</Text>
          </View>
        </View>
      </View>

      {/* Квантовые алгоритмы */}
      <View style={styles.algorithmsSection}>
        <Text style={styles.sectionTitle}>🚀 Квантовые алгоритмы</Text>
        <Text style={styles.sectionSubtitle}>
          Выберите алгоритм для выполнения на квантовом компьютере
        </Text>
        
        <View style={styles.algorithmsGrid}>
          <TouchableOpacity
            style={styles.algorithmButton}
            onPress={() => runAlgorithm('Grover Search', [1, 2, 3, 4, 5])}
            disabled={isRunning || !isQuantumAvailable}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.algorithmGradient}
            >
              <MaterialCommunityIcons name="magnify" size={24} color="#fff" />
              <Text style={styles.algorithmButtonText}>Grover Search</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.algorithmButton}
            onPress={() => runAlgorithm('Quantum Annealing', { variables: 10 })}
            disabled={isRunning || !isQuantumAvailable}
          >
            <LinearGradient
              colors={['#f093fb', '#f5576c']}
              style={styles.algorithmGradient}
            >
              <MaterialCommunityIcons name="fire" size={24} color="#fff" />
              <Text style={styles.algorithmButtonText}>Quantum Annealing</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.algorithmButton}
            onPress={() => runAlgorithm('VQE', { molecules: ['H2', 'LiH'] })}
            disabled={isRunning || !isQuantumAvailable}
          >
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              style={styles.algorithmGradient}
            >
              <MaterialCommunityIcons name="atom" size={24} color="#fff" />
              <Text style={styles.algorithmButtonText}>VQE</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.algorithmButton}
            onPress={() => runAlgorithm('Quantum ML', { dataset: 'kamchatka_tours' })}
            disabled={isRunning || !isQuantumAvailable}
          >
            <LinearGradient
              colors={['#43e97b', '#38f9d7']}
              style={styles.algorithmGradient}
            >
              <MaterialCommunityIcons name="brain" size={24} color="#fff" />
              <Text style={styles.algorithmButtonText}>Quantum ML</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Результаты алгоритмов */}
      {results.length > 0 && (
        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>📊 Результаты выполнения</Text>
          <FlatList
            data={results}
            renderItem={renderAlgorithmResult}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
      )}

      {/* Блокчейн операции */}
      <View style={styles.blockchainSection}>
        <Text style={styles.sectionTitle}>🔗 Блокчейн операции</Text>
        
        <View style={styles.blockchainButtons}>
          <TouchableOpacity
            style={styles.blockchainButton}
            onPress={handleCreateContract}
            disabled={!isBlockchainConnected}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.blockchainButtonGradient}
            >
              <MaterialIcons name="add" size={20} color="#fff" />
              <Text style={styles.blockchainButtonText}>Создать контракт</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.blockchainButton}
            onPress={handleExecuteTransaction}
            disabled={!isBlockchainConnected}
          >
            <LinearGradient
              colors={['#f093fb', '#f5576c']}
              style={styles.blockchainButtonGradient}
            >
              <MaterialIcons name="send" size={20} color="#fff" />
              <Text style={styles.blockchainButtonText}>Выполнить транзакцию</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.blockchainButton}
            onPress={handleCreateQuantumProof}
            disabled={!isQuantumAvailable || !isBlockchainConnected}
          >
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              style={styles.blockchainButtonGradient}
            >
              <MaterialCommunityIcons name="shield-check" size={20} color="#fff" />
              <Text style={styles.blockchainButtonText}>Квантовое доказательство</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.blockchainButton}
            onPress={handleQuantumConsensus}
            disabled={!isQuantumAvailable || !isBlockchainConnected}
          >
            <LinearGradient
              colors={['#43e97b', '#38f9d7']}
              style={styles.blockchainButtonGradient}
            >
              <MaterialCommunityIcons name="handshake" size={20} color="#fff" />
              <Text style={styles.blockchainButtonText}>Квантовый консенсус</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Смарт-контракты */}
      {smartContracts.length > 0 && (
        <View style={styles.contractsSection}>
          <Text style={styles.sectionTitle}>📋 Смарт-контракты</Text>
          <FlatList
            data={smartContracts}
            renderItem={renderSmartContract}
            keyExtractor={item => item.address}
            scrollEnabled={false}
          />
        </View>
      )}

      {/* Транзакции */}
      {blockchainTransactions.length > 0 && (
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>💸 Транзакции</Text>
          <FlatList
            data={blockchainTransactions.slice(-5)} // Последние 5 транзакций
            renderItem={renderTransaction}
            keyExtractor={item => item.hash}
            scrollEnabled={false}
          />
        </View>
      )}

      {/* Информация о технологиях */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>🔬 Технологии будущего</Text>
        <Text style={styles.infoText}>
          Наша система объединяет квантовые вычисления и блокчейн для создания:
        </Text>
        <View style={styles.techList}>
          <Text style={styles.techItem}>• <Text style={styles.techBold}>Квантово-защищенные</Text> транзакции</Text>
          <Text style={styles.techItem}>• <Text style={styles.techBold}>AI-оптимизацию</Text> маршрутов</Text>
          <Text style={styles.techItem}>• <Text style={styles.techBold}>Децентрализованную</Text> репутацию</Text>
          <Text style={styles.techItem}>• <Text style={styles.techBold}>Квантовое машинное обучение</Text></Text>
          <Text style={styles.techItem}>• <Text style={styles.techBold}>Блокчейн-страхование</Text></Text>
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
  statusSection: {
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
    marginBottom: 16,
    color: '#333',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusCard: {
    width: (width - 80) / 2,
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  algorithmsSection: {
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
  algorithmsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  algorithmButton: {
    width: (width - 80) / 2,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  algorithmGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    minHeight: 80,
  },
  algorithmButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    textAlign: 'center',
  },
  resultsSection: {
    padding: 20,
  },
  resultCard: {
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
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  resultDetails: {
    gap: 8,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
  },
  resultValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  runningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  runningText: {
    marginLeft: 8,
    color: '#FF9800',
    fontSize: 16,
  },
  errorText: {
    color: '#F44336',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  blockchainSection: {
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
  blockchainButtons: {
    gap: 12,
  },
  blockchainButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  blockchainButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  blockchainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  contractsSection: {
    padding: 20,
  },
  contractCard: {
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
  contractHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contractName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  contractType: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  contractAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  contractStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contractStat: {
    fontSize: 14,
    color: '#666',
  },
  transactionsSection: {
    padding: 20,
  },
  transactionCard: {
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
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionHash: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  transactionFrom: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  transactionTo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  transactionTime: {
    fontSize: 12,
    color: '#999',
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
  infoText: {
    color: '#666',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  techList: {
    gap: 8,
  },
  techItem: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  techBold: {
    fontWeight: 'bold',
    color: '#333',
  },
});