import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from '../../hooks/useLocation';

export default function ProfileScreen() {
  const { user, signOut, isLoading } = useAuth();
  const { location, requestPermissions } = useLocation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);

  const handleSignOut = () => {
    Alert.alert(
      'Выход',
      'Вы уверены, что хотите выйти из аккаунта?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Выйти',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  const handleLocationPermission = async () => {
    if (!location) {
      const granted = await requestPermissions();
      if (granted) {
        Alert.alert('Успешно', 'Разрешение на геолокацию предоставлено');
      }
    } else {
      Alert.alert('Геолокация', 'Разрешение уже предоставлено');
    }
  };

  const profileSections = [
    {
      title: 'Личная информация',
      items: [
        {
          icon: 'person',
          title: 'Имя',
          value: user?.name || 'Не указано',
          action: 'edit',
        },
        {
          icon: 'mail',
          title: 'Email',
          value: user?.email || 'Не указано',
          action: 'edit',
        },
        {
          icon: 'call',
          title: 'Телефон',
          value: user?.phone || 'Не указано',
          action: 'edit',
        },
      ],
    },
    {
      title: 'Настройки',
      items: [
        {
          icon: 'notifications',
          title: 'Уведомления',
          value: notificationsEnabled ? 'Включены' : 'Отключены',
          action: 'toggle',
          toggleValue: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          icon: 'location',
          title: 'Поделиться местоположением',
          value: locationSharing ? 'Включено' : 'Отключено',
          action: 'toggle',
          toggleValue: locationSharing,
          onToggle: setLocationSharing,
        },
        {
          icon: 'warning',
          title: 'Экстренные уведомления',
          value: emergencyAlerts ? 'Включены' : 'Отключены',
          action: 'toggle',
          toggleValue: emergencyAlerts,
          onToggle: setEmergencyAlerts,
        },
      ],
    },
    {
      title: 'Безопасность',
      items: [
        {
          icon: 'lock-closed',
          title: 'Изменить пароль',
          value: 'Нажмите для изменения',
          action: 'navigate',
        },
        {
          icon: 'shield-checkmark',
          title: 'Двухфакторная аутентификация',
          value: 'Отключена',
          action: 'navigate',
        },
        {
          icon: 'people',
          title: 'Экстренные контакты',
          value: `${user?.emergencyContacts?.length || 0} контактов`,
          action: 'navigate',
        },
      ],
    },
    {
      title: 'Приложение',
      items: [
        {
          icon: 'information-circle',
          title: 'О приложении',
          value: 'Версия 1.0.0',
          action: 'navigate',
        },
        {
          icon: 'help-circle',
          title: 'Помощь и поддержка',
          value: 'FAQ и контакты',
          action: 'navigate',
        },
        {
          icon: 'document-text',
          title: 'Условия использования',
          value: 'Политика и правила',
          action: 'navigate',
        },
        {
          icon: 'shield',
          title: 'Политика конфиденциальности',
          value: 'Обработка данных',
          action: 'navigate',
        },
      ],
    },
  ];

  const renderProfileItem = (item: any, sectionIndex: number, itemIndex: number) => (
    <TouchableOpacity
      key={`${sectionIndex}-${itemIndex}`}
      style={styles.profileItem}
      onPress={() => {
        if (item.action === 'navigate') {
          Alert.alert('Информация', `${item.title} - функция в разработке`);
        } else if (item.action === 'edit') {
          Alert.alert('Редактирование', `Редактирование ${item.title.toLowerCase()} - функция в разработке`);
        }
      }}
    >
      <View style={styles.profileItemLeft}>
        <View style={styles.profileItemIcon}>
          <Ionicons name={item.icon as any} size={20} color="#0891b2" />
        </View>
        <View style={styles.profileItemInfo}>
          <Text style={styles.profileItemTitle}>{item.title}</Text>
          <Text style={styles.profileItemValue}>{item.value}</Text>
        </View>
      </View>
      
      {item.action === 'toggle' ? (
        <Switch
          value={item.toggleValue}
          onValueChange={item.onToggle}
          trackColor={{ false: '#e2e8f0', true: '#0891b2' }}
          thumbColor="#ffffff"
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Загрузка профиля...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notAuthContainer}>
          <Ionicons name="person-circle" size={80} color="#cbd5e1" />
          <Text style={styles.notAuthTitle}>Вы не авторизованы</Text>
          <Text style={styles.notAuthSubtitle}>
            Войдите в аккаунт для доступа к профилю
          </Text>
          <TouchableOpacity style={styles.signInButton}>
            <Text style={styles.signInButtonText}>Войти</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{user.name?.[0] || user.email[0].toUpperCase()}</Text>
          </View>
          <Text style={styles.userName}>{user.name || 'Пользователь'}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          {/* Location Status */}
          <View style={styles.locationStatus}>
            <Ionicons 
              name={location ? "checkmark-circle" : "close-circle"} 
              size={20} 
              color={location ? "#10b981" : "#ef4444"} 
            />
            <Text style={[
              styles.locationStatusText,
              { color: location ? "#10b981" : "#ef4444" }
            ]}>
              {location ? 'Местоположение активно' : 'Местоположение не доступно'}
            </Text>
          </View>
          
          {!location && (
            <TouchableOpacity 
              style={styles.locationButton}
              onPress={handleLocationPermission}
            >
              <Text style={styles.locationButtonText}>Включить геолокацию</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => 
                renderProfileItem(item, sectionIndex, itemIndex)
              )}
            </View>
          </View>
        ))}

        {/* Sign Out Button */}
        <View style={styles.signOutSection}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={styles.signOutButtonText}>Выйти из аккаунта</Text>
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
  },
  notAuthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  notAuthTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 20,
    marginBottom: 8,
  },
  notAuthSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 30,
  },
  signInButton: {
    backgroundColor: '#0891b2',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  profileHeader: {
    backgroundColor: '#0891b2',
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0891b2',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#e0f2fe',
    marginBottom: 16,
  },
  locationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationStatusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  locationButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  locationButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileItemInfo: {
    flex: 1,
  },
  profileItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  profileItemValue: {
    fontSize: 14,
    color: '#64748b',
  },
  signOutSection: {
    padding: 20,
    marginTop: 20,
  },
  signOutButton: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  signOutButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});