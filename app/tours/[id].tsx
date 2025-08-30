import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { track } from '../../lib/analytics';
import { useOrders } from '../../hooks/useOrders';

const sampleTours = [
  { id: '1', title: 'Вулкан Мутновский', difficulty: 'medium', price: 8000, days: 1, desc: 'Восхождение на действующий вулкан с видом на кратер.' },
  { id: '2', title: 'Долина гейзеров', difficulty: 'easy', price: 15000, days: 2, desc: 'Экскурсия в уникальную долину с горячими источниками.' },
  { id: '3', title: 'Медвежье сафари', difficulty: 'easy', price: 12000, days: 1, desc: 'Наблюдение за бурыми медведями в естественной среде.' },
];

export default function TourDetails() {
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { createOrder } = useOrders();

  const tour = useMemo(() => sampleTours.find(t => t.id === String(params.id)), [params.id]);

  if (!tour) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}> 
          <Text style={styles.title}>Тур не найден</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.link}>Назад</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  track('view_item_detail', { id: tour.id });

  const handleCheckout = async () => {
    track('begin_checkout', { id: tour.id });
    const order = await createOrder([{ id: tour.id, kind: 'tours', title: tour.title, price: tour.price, quantity: 1 }]);
    Alert.alert('Бронь создана', `Заказ №${order.id} на сумму ${order.total} ₽`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{tour.title}</Text>
          <Text style={styles.headerSub}>{tour.days} дн • {tour.difficulty} • {tour.price} ₽</Text>
        </View>
        <View style={styles.body}> 
          <Text style={styles.desc}>{tour.desc}</Text>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cta} onPress={handleCheckout}>
            <Text style={styles.ctaText}>Оформить бронь</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { flex: 1 },
  center: { flex:1, justifyContent:'center', alignItems:'center', padding: 20 },
  header: { padding: 20, backgroundColor: '#0891b2', alignItems: 'center' },
  headerTitle: { color:'#fff', fontSize:22, fontWeight:'700' },
  headerSub: { color:'#e0f2fe', marginTop: 6 },
  title: { fontSize: 20, fontWeight: '700', color:'#1e293b' },
  link: { marginTop: 8, color:'#0891b2' },
  body: { padding: 20 },
  desc: { fontSize: 16, color:'#334155', lineHeight: 22 },
  footer: { padding: 20 },
  cta: { backgroundColor:'#0891b2', borderRadius:12, paddingVertical:14, alignItems:'center' },
  ctaText: { color:'#fff', fontSize:16, fontWeight:'700' },
});

