import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';

export default function BookingScreen() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('tours');
  const [searchQuery, setSearchQuery] = useState('');

  const tours = [
    {
      id: '1',
      title: 'Вулкан Мутновский',
      description: 'Восхождение на действующий вулкан с видом на кратер',
      duration: '1 день',
      price: 8000,
      rating: 4.8,
      reviews: 127,
      image: '🌋',
      category: 'tours',
      difficulty: 'Средний',
      groupSize: '6-12 человек',
    },
    {
      id: '2',
      title: 'Долина гейзеров',
      description: 'Экскурсия в уникальную долину с горячими источниками',
      duration: '2 дня',
      price: 15000,
      rating: 4.9,
      reviews: 89,
      image: '♨️',
      category: 'tours',
      difficulty: 'Легкий',
      groupSize: '8-15 человек',
    },
    {
      id: '3',
      title: 'Медвежье сафари',
      description: 'Наблюдение за бурыми медведями в естественной среде',
      duration: '1 день',
      price: 12000,
      rating: 4.7,
      reviews: 156,
      image: '🐻',
      category: 'tours',
      difficulty: 'Легкий',
      groupSize: '4-8 человек',
    },
  ];

  const activities = [
    {
      id: '1',
      title: 'Рыбалка на лосося',
      description: 'Рыбалка на реке Камчатка с опытным гидом',
      duration: '6 часов',
      price: 5000,
      rating: 4.6,
      reviews: 73,
      image: '🎣',
      category: 'activities',
      equipment: 'Включено',
      maxPeople: 4,
    },
    {
      id: '2',
      title: 'Каякинг по Авачинской бухте',
      description: 'Морская прогулка на каяках с видом на вулканы',
      duration: '4 часа',
      price: 3500,
      rating: 4.5,
      reviews: 45,
      image: '🛶',
      category: 'activities',
      equipment: 'Включено',
      maxPeople: 6,
    },
  ];

  const accommodations = [
    {
      id: '1',
      title: 'Эко-лодж "Камчатские просторы"',
      description: 'Комфортное размещение в сердце дикой природы',
      price: 5000,
      rating: 4.8,
      reviews: 234,
      image: '🏕️',
      category: 'accommodations',
      amenities: ['Wi-Fi', 'Ресторан', 'Сауна', 'Трансфер'],
      capacity: '2-4 человека',
    },
    {
      id: '2',
      title: 'Гостевой дом "У моря"',
      description: 'Уютный дом с видом на Тихий океан',
      price: 3500,
      rating: 4.6,
      reviews: 189,
      image: '🏠',
      category: 'accommodations',
      amenities: ['Кухня', 'Парковка', 'Терраса'],
      capacity: '2-6 человек',
    },
  ];

  const categories = [
    { id: 'tours', name: 'Туры', icon: '🗺️' },
    { id: 'activities', name: 'Активности', icon: '🎯' },
    { id: 'accommodations', name: 'Проживание', icon: '🏠' },
  ];

  const getFilteredItems = () => {
    let items: any[] = [];
    
    switch (selectedCategory) {
      case 'tours':
        items = tours;
        break;
      case 'activities':
        items = activities;
        break;
      case 'accommodations':
        items = accommodations;
        break;
      default:
        items = [...tours, ...activities, ...accommodations];
    }

    if (searchQuery) {
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return items;
  };

  const handleBooking = (item: any) => {
    if (!user) {
      Alert.alert('Вход', 'Для бронирования необходимо войти в систему');
      return;
    }

    Alert.alert(
      'Бронирование',
      `Забронировать "${item.title}" за ${item.price} ₽?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Забронировать',
          onPress: () => {
            Alert.alert('Успешно', 'Ваше бронирование подтверждено!');
          },
        },
      ]
    );
  };

  const renderTourCard = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardImage}>{item.image}</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
          <View style={styles.cardMeta}>
            <Text style={styles.cardDuration}>{item.duration}</Text>
            <Text style={styles.cardDifficulty}>• {item.difficulty}</Text>
            <Text style={styles.cardGroupSize}>• {item.groupSize}</Text>
          </View>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.cardRating}>
          <Ionicons name="star" size={16} color="#fbbf24" />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewsText}>({item.reviews})</Text>
        </View>
        <View style={styles.cardPrice}>
          <Text style={styles.priceText}>{item.price} ₽</Text>
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => handleBooking(item)}
          >
            <Text style={styles.bookButtonText}>Забронировать</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderActivityCard = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardImage}>{item.image}</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
          <View style={styles.cardMeta}>
            <Text style={styles.cardDuration}>{item.duration}</Text>
            <Text style={styles.cardEquipment}>• Оборудование: {item.equipment}</Text>
            <Text style={styles.cardMaxPeople}>• До {item.maxPeople} чел.</Text>
          </View>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.cardRating}>
          <Ionicons name="star" size={16} color="#fbbf24" />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewsText}>({item.reviews})</Text>
        </View>
        <View style={styles.cardPrice}>
          <Text style={styles.priceText}>{item.price} ₽</Text>
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => handleBooking(item)}
          >
            <Text style={styles.bookButtonText}>Забронировать</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderAccommodationCard = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardImage}>{item.image}</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
          <View style={styles.cardMeta}>
            <Text style={styles.cardCapacity}>{item.capacity}</Text>
            <View style={styles.amenitiesContainer}>
              {item.amenities.slice(0, 3).map((amenity: string, index: number) => (
                <Text key={index} style={styles.amenity}>• {amenity}</Text>
              ))}
            </View>
          </View>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.cardRating}>
          <Ionicons name="star" size={16} color="#fbbf24" />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewsText}>({item.reviews})</Text>
        </View>
        <View style={styles.cardPrice}>
          <Text style={styles.priceText}>{item.price} ₽/ночь</Text>
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => handleBooking(item)}
          >
            <Text style={styles.bookButtonText}>Забронировать</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCard = (item: any) => {
    switch (item.category) {
      case 'tours':
        return renderTourCard(item);
      case 'activities':
        return renderActivityCard(item);
      case 'accommodations':
        return renderAccommodationCard(item);
      default:
        return renderTourCard(item);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Бронирование</Text>
          <Text style={styles.headerSubtitle}>
            Забронируйте туры, активности и проживание на Камчатке
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#64748b" />
            <TextInput
              style={styles.searchInput}
              placeholder="Поиск туров, активностей..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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

        {/* Items List */}
        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'tours' ? 'Туры' :
             selectedCategory === 'activities' ? 'Активности' :
             selectedCategory === 'accommodations' ? 'Проживание' : 'Все предложения'}
          </Text>
          {getFilteredItems().map(renderCard)}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Быстрые действия</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="calendar" size={24} color="#0891b2" />
              <Text style={styles.actionText}>Мои брони</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="heart" size={24} color="#0891b2" />
              <Text style={styles.actionText}>Избранное</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="help-circle" size={24} color="#0891b2" />
              <Text style={styles.actionText}>Помощь</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="call" size={24} color="#0891b2" />
              <Text style={styles.actionText}>Поддержка</Text>
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
    backgroundColor: '#0891b2',
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
    color: '#e0f2fe',
    textAlign: 'center',
  },
  searchContainer: {
    padding: 20,
  },
  searchBar: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryButtonActive: {
    backgroundColor: '#0891b2',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  categoryNameActive: {
    color: '#ffffff',
  },
  itemsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  cardImage: {
    fontSize: 40,
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  cardDuration: {
    fontSize: 14,
    color: '#0891b2',
    fontWeight: '600',
  },
  cardDifficulty: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
  },
  cardGroupSize: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
  },
  cardEquipment: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
  },
  cardMaxPeople: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
  },
  cardCapacity: {
    fontSize: 14,
    color: '#0891b2',
    fontWeight: '600',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  amenity: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
  cardPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0891b2',
    marginBottom: 8,
  },
  bookButton: {
    backgroundColor: '#0891b2',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
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