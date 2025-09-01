import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrders } from '../../hooks/useOrders';

export default function OrdersScreen() {
  const { orders } = useOrders();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Мои заказы</Text>
        </View>
        <View style={styles.list}>
          {orders.map(o => (
            <View key={o.id} style={styles.card}>
              <Text style={styles.cardTitle}>Заказ #{o.id}</Text>
              <Text style={styles.cardSub}>{new Date(o.createdAt).toLocaleString()}</Text>
              <Text style={styles.cardStatus}>Статус: {o.status}</Text>
              <Text style={styles.cardPrice}>Сумма: {o.total} ₽</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { flex: 1 },
  header: { padding: 20, backgroundColor: '#0891b2', alignItems: 'center' },
  title: { color:'#fff', fontSize:22, fontWeight:'700' },
  list: { padding: 20, gap: 12 },
  card: { backgroundColor:'#fff', borderRadius:12, padding:16 },
  cardTitle: { fontSize:16, fontWeight:'700', color:'#1e293b' },
  cardSub: { fontSize:12, color:'#64748b', marginTop: 4 },
  cardStatus: { fontSize:14, color:'#334155', marginTop: 8 },
  cardPrice: { fontSize:14, color:'#0891b2', marginTop: 4, fontWeight:'700' },
});

