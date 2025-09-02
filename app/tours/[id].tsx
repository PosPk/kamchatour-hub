import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getTourById, Tour } from '../../lib/tours';

export default function TourDetail(){
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  useEffect(()=>{ (async()=>{ if(!id) return; setTour(await getTourById(String(id))); })(); },[id]);
  if(!tour) return <View style={styles.container}><Text>Загрузка…</Text></View>;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {tour.imageUrl ? <Image source={{ uri: tour.imageUrl }} style={styles.cover} /> : <View style={[styles.cover,{backgroundColor:'#e2e8f0'}]} />}
      <Text style={styles.title}>{tour.title}</Text>
      <Text style={styles.meta}>{tour.activity} • {tour.region} • {tour.durationDays} дн.</Text>
      {!!tour.description && <Text style={styles.desc}>{tour.description}</Text>}
      <View style={styles.card}>
        <Text style={styles.price}>{tour.priceFrom.toLocaleString('ru-RU')} ₽</Text>
        <Text style={styles.note}>Цена от оператора. Бронирование через оператора, мы — гарант.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f8fafc' },
  cover: { width: '100%', height: 220, borderRadius: 12 },
  title: { fontSize: 22, fontWeight: '800', color: '#0f172a', marginTop: 12 },
  meta: { color: '#475569', marginTop: 4 },
  desc: { color: '#334155', marginTop: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', padding: 12, marginTop: 12 },
  price: { color: '#065f46', fontWeight: '800', fontSize: 18 },
  note: { color: '#64748b', marginTop: 6 },
});

