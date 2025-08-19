import React, { useMemo, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { getMockListingById, calculateNights } from '../src/services/search';
import { formatMoney } from '../src/utils/money';

export default function Checkout() {
  const params = useLocalSearchParams();
  const { id, checkIn, checkOut, guests } = params;
  const listing = useMemo(() => getMockListingById(String(id)), [id]);
  const nights = useMemo(() => calculateNights(String(checkIn), String(checkOut)), [checkIn, checkOut]);

  const [name, setName] = useState('Иван Иванов');
  const [email, setEmail] = useState('ivan@example.com');
  const [phone, setPhone] = useState('+7 999 000 11 22');

  if (!listing) {
    return <View style={styles.container}><Text style={styles.title}>Объект не найден</Text></View>;
  }

  const totalRub = listing.priceRub * nights;
  const feeRub = Math.round(totalRub * 0.08);
  const finalRub = totalRub + feeRub;

  const confirm = () => {
    router.push({ pathname: '/confirm', params: { id: String(id), checkIn, checkOut, guests, name, email, phone, finalRub: String(finalRub) } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Оформление бронирования</Text>
      <Text style={styles.meta}>{listing.name}</Text>
      <Text style={styles.meta}>Заезд {checkIn}, выезд {checkOut} · {guests} гостя(ей) · {nights} ночи</Text>

      <View style={styles.card}>
        <Text style={styles.section}>Данные гостя</Text>
        <Field label="Имя" value={name} onChangeText={setName} />
        <Field label="Email" value={email} onChangeText={setEmail} />
        <Field label="Телефон" value={phone} onChangeText={setPhone} />
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Итого</Text>
        <Text style={styles.meta}>Цена: {formatMoney(totalRub)}</Text>
        <Text style={styles.meta}>Сервисный сбор: {formatMoney(feeRub)}</Text>
        <Text style={[styles.total, { marginTop: 6 }]}>К оплате: {formatMoney(finalRub)}</Text>
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
  button: { backgroundColor: '#22c55e', marginTop: 12, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#052e16', fontWeight: '800' }
});

