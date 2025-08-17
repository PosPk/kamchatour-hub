import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

interface RoutePreferences {
  duration: string;
  difficulty: string;
  interests: string[];
  budget: string;
  groupSize: string;
  transportation: string;
}

interface QuantumRoute {
  id: string;
  name: string;
  duration: string;
  difficulty: string;
  score: number;
  destinations: string[];
  description: string;
  estimatedCost: number;
}

export default function QuantumRouteScreen() {
  const [preferences, setPreferences] = useState<RoutePreferences>({
    duration: '3-5 дней',
    difficulty: 'Средний',
    interests: [],
    budget: 'Средний',
    groupSize: '2-4 человека',
    transportation: 'Автомобиль',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRoutes, setGeneratedRoutes] = useState<QuantumRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<QuantumRoute | null>(null);

  const durationOptions = ['1-2 дня', '3-5 дней', '1 неделя', '2 недели'];
  const difficultyOptions = ['Легкий', 'Средний', 'Сложный', 'Экстремальный'];
  const budgetOptions = ['Экономный', 'Средний', 'Премиум', 'Люкс'];
  const groupSizeOptions = ['1 человек', '2-4 человека', '5-8 человек', '9+ человек'];
  const transportationOptions = ['Автомобиль', 'Вертолет', 'Пешком', 'Комбинированный'];

  const interestOptions = [
    'Вулканы', 'Гейзеры', 'Медведи', 'Рыбалка', 'Термальные источники',
    'Фотография', 'Экстремальный спорт', 'Культура', 'Природа', 'История'
  ];

  const toggleInterest = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const generateQuantumRoute = async () => {
    if (preferences.interests.length === 0) {
      Alert.alert('Ошибка', 'Выберите хотя бы один интерес');
      return;
    }

    setIsGenerating(true);
    
    // Имитация квантового вычисления
    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockRoutes: QuantumRoute[] = [
      {
        id: '1',
        name: 'Квантовый тур "Огненная Камчатка"',
        duration: '5 дней',
        difficulty: 'Средний',
        score: 98,
        destinations: ['Ключевская сопка', 'Долина гейзеров', 'Термальные источники'],
        description: 'Оптимальный маршрут через самые впечатляющие вулканы и гейзеры Камчатки',
        estimatedCost: 45000
      },
      {
        id: '2',
        name: 'Маршрут "Медвежья тропа"',
        duration: '3 дня',
        difficulty: 'Легкий',
        score: 92,
        destinations: ['Курильское озеро', 'Камчатский залив', 'Лесные тропы'],
        description: 'Идеально для наблюдения за медведями и дикой природой',
        estimatedCost: 28000
      },
      {
        id: '3',
        name: 'Экстремальный "Квантовый прыжок"',
        duration: '7 дней',
        difficulty: 'Экстремальный',
        score: 95,
        destinations: ['Авачинская сопка', 'Мутновский вулкан', 'Голубые озера'],
        description: 'Для опытных туристов, готовых к сложным восхождениям',
        estimatedCost: 65000
      }
    ];

    setGeneratedRoutes(mockRoutes);
    setIsGenerating(false);
  };

  const selectRoute = (route: QuantumRoute) => {
    setSelectedRoute(route);
  };

  const bookRoute = (route: QuantumRoute) => {
    Alert.alert(
      'Бронирование маршрута',
      `Маршрут "${route.name}" забронирован!\n\nСтоимость: ${route.estimatedCost} ₽\n\nНаш менеджер свяжется с вами в течение 2 часов.`,
      [{ text: 'Отлично!', style: 'default' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Заголовок */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <MaterialCommunityIcons name="quantum-entanglement" size={40} color="#fff" />
        <Text style={styles.headerTitle}>Квантовый планировщик</Text>
        <Text style={styles.headerSubtitle}>
          AI-алгоритмы создают идеальный маршрут для вас
        </Text>
      </LinearGradient>

      {/* Настройки предпочтений */}
      <View style={styles.preferencesSection}>
        <Text style={styles.sectionTitle}>⚙️ Настройки маршрута</Text>
        
        {/* Длительность */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Длительность путешествия</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={preferences.duration}
              onValueChange={(value) => setPreferences(prev => ({ ...prev, duration: value }))}
              style={styles.picker}
            >
              {durationOptions.map(option => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Сложность */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Уровень сложности</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={preferences.difficulty}
              onValueChange={(value) => setPreferences(prev => ({ ...prev, difficulty: value }))}
              style={styles.picker}
            >
              {difficultyOptions.map(option => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Интересы */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Ваши интересы</Text>
          <View style={styles.interestsGrid}>
            {interestOptions.map(interest => (
              <TouchableOpacity
                key={interest}
                style={[
                  styles.interestChip,
                  preferences.interests.includes(interest) && styles.interestChipSelected
                ]}
                onPress={() => toggleInterest(interest)}
              >
                <Text style={[
                  styles.interestChipText,
                  preferences.interests.includes(interest) && styles.interestChipTextSelected
                ]}>
                  {interest}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Бюджет */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Бюджет</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={preferences.budget}
              onValueChange={(value) => setPreferences(prev => ({ ...prev, budget: value }))}
              style={styles.picker}
            >
              {budgetOptions.map(option => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Размер группы */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Размер группы</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={preferences.groupSize}
              onValueChange={(value) => setPreferences(prev => ({ ...prev, groupSize: value }))}
              style={styles.picker}
            >
              {groupSizeOptions.map(option => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Транспорт */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Предпочитаемый транспорт</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={preferences.transportation}
              onValueChange={(value) => setPreferences(prev => ({ ...prev, transportation: value }))}
              style={styles.picker}
            >
              {transportationOptions.map(option => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Кнопка генерации */}
        <TouchableOpacity
          style={styles.generateButton}
          onPress={generateQuantumRoute}
          disabled={isGenerating}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.generateButtonGradient}
          >
            {isGenerating ? (
              <ActivityIndicator color="#fff" size="large" />
            ) : (
              <>
                <MaterialCommunityIcons name="quantum-entanglement" size={24} color="#fff" />
                <Text style={styles.generateButtonText}>Создать квантовый маршрут</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Сгенерированные маршруты */}
      {generatedRoutes.length > 0 && (
        <View style={styles.routesSection}>
          <Text style={styles.sectionTitle}>🎯 Рекомендуемые маршруты</Text>
          {generatedRoutes.map(route => (
            <TouchableOpacity
              key={route.id}
              style={[
                styles.routeCard,
                selectedRoute?.id === route.id && styles.routeCardSelected
              ]}
              onPress={() => selectRoute(route)}
            >
              <View style={styles.routeHeader}>
                <Text style={styles.routeName}>{route.name}</Text>
                <View style={styles.routeScore}>
                  <Text style={styles.routeScoreText}>{route.score}%</Text>
                </View>
              </View>
              
              <View style={styles.routeDetails}>
                <View style={styles.routeDetail}>
                  <MaterialIcons name="schedule" size={16} color="#666" />
                  <Text style={styles.routeDetailText}>{route.duration}</Text>
                </View>
                <View style={styles.routeDetail}>
                  <MaterialIcons name="fitness-center" size={16} color="#666" />
                  <Text style={styles.routeDetailText}>{route.difficulty}</Text>
                </View>
                <View style={styles.routeDetail}>
                  <MaterialIcons name="attach-money" size={16} color="#666" />
                  <Text style={styles.routeDetailText}>{route.estimatedCost} ₽</Text>
                </View>
              </View>

              <Text style={styles.routeDescription}>{route.description}</Text>
              
              <View style={styles.routeDestinations}>
                <Text style={styles.destinationsTitle}>Основные точки:</Text>
                {route.destinations.map((dest, index) => (
                  <Text key={index} style={styles.destinationItem}>• {dest}</Text>
                ))}
              </View>

              {selectedRoute?.id === route.id && (
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => bookRoute(route)}
                >
                  <LinearGradient
                    colors={['#43e97b', '#38f9d7']}
                    style={styles.bookButtonGradient}
                  >
                    <Text style={styles.bookButtonText}>Забронировать маршрут</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Информация о квантовых алгоритмах */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>🔬 Как работают квантовые алгоритмы</Text>
        <Text style={styles.infoText}>
          Наш квантовый планировщик использует передовые AI и квантовые алгоритмы:
        </Text>
        <View style={styles.algorithmList}>
          <Text style={styles.algorithmItem}>• <Text style={styles.algorithmBold}>Grover's Algorithm</Text> - для поиска оптимальных маршрутов</Text>
          <Text style={styles.algorithmItem}>• <Text style={styles.algorithmBold}>Quantum Annealing</Text> - для решения задач оптимизации</Text>
          <Text style={styles.algorithmItem}>• <Text style={styles.algorithmBold}>VQE</Text> - для анализа сложных маршрутов</Text>
          <Text style={styles.algorithmItem}>• <Text style={styles.algorithmBold}>Neural Networks</Text> - для предсказания предпочтений</Text>
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
  preferencesSection: {
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
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  interestChipSelected: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  interestChipText: {
    color: '#666',
    fontSize: 14,
  },
  interestChipTextSelected: {
    color: '#fff',
  },
  generateButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  generateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  routesSection: {
    padding: 20,
  },
  routeCard: {
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
  routeCardSelected: {
    borderWidth: 2,
    borderColor: '#667eea',
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  routeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  routeScore: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  routeScoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  routeDetails: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 20,
  },
  routeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  routeDetailText: {
    color: '#666',
    fontSize: 14,
  },
  routeDescription: {
    color: '#333',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  routeDestinations: {
    marginBottom: 16,
  },
  destinationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  destinationItem: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  bookButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  bookButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  bookButtonText: {
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
  infoText: {
    color: '#666',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  algorithmList: {
    gap: 8,
  },
  algorithmItem: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  algorithmBold: {
    fontWeight: 'bold',
    color: '#333',
  },
});