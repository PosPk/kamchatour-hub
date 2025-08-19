import React, { useMemo } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { getMockListingById } from '../../src/services/search';
import { formatMoney } from '../../src/utils/money';

export default function Listing() {
  const params = useLocalSearchParams();
  const { id, checkIn = '2025-10-01', checkOut = '2025-10-03', guests = '2' } = params;
  const listing = useMemo(() => getMockListingById(String(id)), [id]);

  const goCheckout = () => router.push({ pathname: '/checkout', params: { id: String(id), checkIn, checkOut, guests } });

  if (!listing) {
    return (
      <View style={styles.container}><Text style={styles.title}>Объект не найден</Text></View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{listing.name}</Text>
      <Text style={styles.meta}>Рейтинг {listing.rating.toFixed(1)} · {listing.reviews} отзывов</Text>
      <Text style={styles.meta}>Адрес: {listing.address}</Text>
      <Text style={[styles.meta, { marginTop: 6 }]}>Правила отмены: Бесплатно до 24ч до заезда</Text>
      <View style={styles.priceBox}>
        <Text style={styles.priceTitle}>Цена</Text>
        <Text style={styles.priceValue}>{formatMoney(listing.priceRub)}/ночь</Text>
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
  button: { backgroundColor: '#2563eb', marginTop: 12, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' }
});

