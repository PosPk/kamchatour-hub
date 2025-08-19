import React, { useMemo, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { getMockTransferById } from '../../src/services/transfers';
import { formatMoney } from '../../src/utils/money';

export default function TransferCheckout() {
  const { id, from, to, date, people } = useLocalSearchParams();
  const item = useMemo(() => getMockTransferById(String(id)), [id]);
  const qty = Number(people) || 1;

  const [name, setName] = useState('Иван Иванов');
  const [email, setEmail] = useState('ivan@example.com');
  const [phone, setPhone] = useState('+7 999 000 11 22');
  const [flight, setFlight] = useState('SU1234');

  if (!item) return <View style={styles.container}><Text style={styles.title}>Транспорт не найден</Text></View>;

  const subtotal = item.priceRub; // за машину/маршрут
  const fee = Math.round(subtotal * 0.05);
  const total = subtotal + fee;

  const confirm = () => router.push({ pathname: '/transfers/confirm', params: { id: String(id), from, to, date, people, name, email, phone, flight, total: String(total) } });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Оформление трансфера</Text>
      <Text style={styles.meta}>{item.vehicle} · {item.capacity} мест · {item.company}</Text>
      <Text style={styles.meta}>Маршрут: {from} → {to} · Дата: {date} · Пассажиров: {qty}</Text>

      <View style={styles.card}>
        <Text style={styles.section}>Данные пассажира</Text>
        <Field label="Имя" value={name} onChangeText={setName} />
        <Field label="Email" value={email} onChangeText={setEmail} />
        <Field label="Телефон" value={phone} onChangeText={setPhone} />
        <Field label="Рейс (если есть)" value={flight} onChangeText={setFlight} />
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Итого</Text>
        <Text style={styles.meta}>Стоимость: {formatMoney(subtotal)}</Text>
        <Text style={styles.meta}>Сбор: {formatMoney(fee)}</Text>
        <Text style={[styles.total, { marginTop: 6 }]}>К оплате: {formatMoney(total)}</Text>
      </View>

      <Pressable onPress={confirm} style={styles.button}><Text style={styles.buttonText}>Подтвердить</Text></Pressable>
    </View>
  );
}

function Field({ label, ...props }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput {...props} style={styles.input} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#0b1220' },
  title: { color: '#e5e7eb', fontWeight: '700', fontSize: 20, marginBottom: 6 },
  meta: { color: '#94a3b8', fontSize: 13 },
  card: { backgroundColor: '#111827', borderColor: '#1f2937', borderWidth: 1, borderRadius: 12, padding: 12, marginTop: 12 },
  section: { color: '#e5e7eb', fontWeight: '700', marginBottom: 8 },
  label: { color: '#94a3b8', marginBottom: 6 },
  input: { backgroundColor: '#0f172a', borderColor: '#1f2937', borderWidth: 1, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, color: '#e5e7eb' },
  total: { color: '#34d399', fontWeight: '700' },
  button: { backgroundColor: '#f59e0b', marginTop: 12, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#7c2d12', fontWeight: '800' }
});

