import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';

export default function AuthScreen() {
  const { signIn, isLoading } = useAuth();

  const handleDemoLogin = async () => {
    try {
      await signIn('demo@kamchatka.ru', 'demo123');
      Alert.alert('Успешный вход', 'Вы вошли как демо-пользователь');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
      Alert.alert('Ошибка входа', message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход</Text>
      <Text style={styles.subtitle}>Используйте демо-аккаунт для входа</Text>
      <Button title={isLoading ? 'Входим...' : 'Войти как демо'} onPress={handleDemoLogin} disabled={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
});

