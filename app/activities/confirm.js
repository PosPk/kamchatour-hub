import React from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { formatMoney } from '../../src/utils/money';

export default function ActivityConfirm() {
  const { id, date, people, name, email, phone, total } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Бронирование активности подтверждено 🎉</Text>
      <Text style={styles.meta}>№ заказа: ACT-{String(id).padStart(4, '0')}</Text>
      <Text style={styles.meta}>Дата: {date} · Участников: {people}</Text>
      <Text style={styles.meta}>Гость: {name} ({email}, {phone})</Text>
      <Text style={[styles.total, { marginTop: 8 }]}>Оплачено: {formatMoney(Number(total || '0'))}</Text>
      <Pressable onPress={() => router.replace('/')} style={styles.button}><Text style={styles.buttonText}>На главную</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#0b1220' },
  title: { color: '#e5e7eb', fontWeight: '700', fontSize: 20, marginBottom: 6 },
  meta: { color: '#94a3b8', fontSize: 13 },
  total: { color: '#34d399', fontWeight: '700' },
  button: { backgroundColor: '#2563eb', marginTop: 12, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' }
});

