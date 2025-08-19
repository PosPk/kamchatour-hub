import React, { useState } from 'react';
import { Link, router } from 'expo-router';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';

export default function Index() {
  const [where, setWhere] = useState('Москва');
  const [checkIn, setCheckIn] = useState('2025-10-01');
  const [checkOut, setCheckOut] = useState('2025-10-03');
  const [guests, setGuests] = useState('2');

  const goSearch = () => {
    router.push({
      pathname: '/results',
      params: { where, checkIn, checkOut, guests }
    });
  };

  const goActivities = () => {
    router.push({ pathname: '/activities/results', params: { where, date: checkIn, people: guests } });
  };

  const goTransfers = () => {
    router.push({ pathname: '/transfers/results', params: { from: where, to: 'Аэропорт', date: checkIn, people: guests } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Найдите место для пребывания</Text>
      <View style={styles.card}>
        <LabeledInput label="Куда" value={where} onChangeText={setWhere} placeholder="Город, район" />
        <View style={styles.row}>
          <LabeledInput style={{ flex: 1, marginRight: 8 }} label="Заезд" value={checkIn} onChangeText={setCheckIn} placeholder="ГГГГ-ММ-ДД" />
          <LabeledInput style={{ flex: 1, marginLeft: 8 }} label="Выезд" value={checkOut} onChangeText={setCheckOut} placeholder="ГГГГ-ММ-ДД" />
        </View>
        <LabeledInput label="Гостей" value={guests} onChangeText={setGuests} placeholder="2" keyboardType="numeric" />
        <Pressable style={styles.button} onPress={goSearch}>
          <Text style={styles.buttonText}>Жильё — Показать результаты</Text>
        </Pressable>
        <Pressable style={[styles.button, { backgroundColor: '#10b981' }]} onPress={goActivities}>
          <Text style={styles.buttonText}>Активности — Найти</Text>
        </Pressable>
        <Pressable style={[styles.button, { backgroundColor: '#f59e0b' }]} onPress={goTransfers}>
          <Text style={styles.buttonText}>Трансфер — Найти</Text>
        </Pressable>
      </View>

      <Link href={{ pathname: '/results', params: { where: 'Москва', checkIn: '2025-10-01', checkOut: '2025-10-03', guests: '2' } }} style={styles.link}>
        Быстрый пример результатов
      </Link>
    </View>
  );
}

function LabeledInput({ label, style, ...props }) {
  return (
    <View style={[{ marginBottom: 12 }, style]}> 
      <Text style={styles.label}>{label}</Text>
      <TextInput {...props} style={styles.input} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#0b1220' },
  title: { color: '#e5e7eb', fontSize: 22, fontWeight: '700', marginBottom: 12 },
  label: { color: '#94a3b8', marginBottom: 6 },
  input: {
    backgroundColor: '#0f172a', borderColor: '#1f2937', borderWidth: 1, borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 12, color: '#e5e7eb'
  },
  card: { backgroundColor: '#111827', borderColor: '#1f2937', borderWidth: 1, borderRadius: 12, padding: 16 },
  row: { flexDirection: 'row' },
  button: { backgroundColor: '#2563eb', marginTop: 8, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  link: { color: '#93c5fd', marginTop: 16 }
});

