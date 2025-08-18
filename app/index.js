import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Главная</Text>
      <Text style={styles.subtitle}>Обзор ключевых разделов</Text>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Передовые идеи и результаты реализаций</Text>
        <Text style={styles.blockText}>Собрали лучшие практики, пилоты и внедрения — фильтруйте по тегам и ищите вдохновение.</Text>
        <Link href="/innovations" asChild>
          <Pressable style={styles.cta}>
            <Text style={styles.ctaText}>Открыть раздел</Text>
          </Pressable>
        </Link>
      </View>

      <View style={{ height: 16 }} />

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Фотоотчёты</Text>
        <Text style={styles.blockText}>Создавайте короткие отчёты с фото за пару нажатий — камера или галерея, минимум полей.</Text>
        <Link href="/reports" asChild>
          <Pressable style={styles.cta}>
            <Text style={styles.ctaText}>Открыть фотоотчёты</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7fa',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: '#6b7280',
    marginBottom: 16,
  },
  block: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  blockText: {
    color: '#374151',
    marginBottom: 12,
  },
  cta: {
    alignSelf: 'flex-start',
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  ctaText: {
    color: 'white',
    fontWeight: '700',
  },
});

