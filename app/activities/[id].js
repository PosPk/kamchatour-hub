import React, { useMemo } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { getMockActivityById } from '../../src/services/activities';
import { formatMoney } from '../../src/utils/money';

export default function Activity() {
  const { id, date = '2025-10-01', people = '2' } = useLocalSearchParams();
  const item = useMemo(() => getMockActivityById(String(id)), [id]);

  if (!item) return <View style={styles.container}><Text style={styles.title}>Активность не найдена</Text></View>;

  const goCheckout = () => router.push({ pathname: '/activities/checkout', params: { id: String(id), date, people } });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.meta}>Рейтинг {item.rating.toFixed(1)} · {item.reviews} отзывов</Text>
      <Text style={styles.meta}>Длительность: {item.durationHours} ч</Text>
      <Text style={styles.meta}>Правила отмены: {item.freeCancel ? 'Бесплатная отмена до 24ч' : 'Невозвратное'}</Text>
      <View style={styles.priceBox}>
        <Text style={styles.priceTitle}>Цена</Text>
        <Text style={styles.priceValue}>{formatMoney(item.priceRub)}/чел</Text>
      </View>
      <Pressable onPress={goCheckout} style={styles.button}><Text style={styles.buttonText}>Забронировать</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#0b1220' },
  title: { color: '#e5e7eb', fontWeight: '700', fontSize: 20, marginBottom: 6 },
  meta: { color: '#94a3b8', fontSize: 13 },
  priceBox: { backgroundColor: '#111827', borderColor: '#1f2937', borderWidth: 1, borderRadius: 12, padding: 12, marginTop: 12 },
  priceTitle: { color: '#e5e7eb', marginBottom: 4 },
  priceValue: { color: '#34d399', fontWeight: '700', fontSize: 18 },
  button: { backgroundColor: '#10b981', marginTop: 12, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#052e16', fontWeight: '800' }
});

