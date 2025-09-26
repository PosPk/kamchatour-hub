import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { listBookings, Booking } from '../../lib/bookings';
import { theme } from '../../lib/theme';

export default function TripsScreen(){
  const [items, setItems] = useState<Booking[]>([]);
  const router = useRouter();
  useEffect(() => { (async () => setItems(await listBookings()))(); }, []);
  return (
    <View style={styles.container}>
      <FlatList data={items} keyExtractor={i=>i.id} renderItem={({item}) => (
        <TouchableOpacity style={styles.card} onPress={()=>router.push(`/trips/${item.id}`)}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.sub}>{item.operatorName} • {new Date(item.dateFrom).toLocaleDateString('ru-RU')}</Text>
          <Text style={styles.badge}>{item.status==='confirmed'?'Подтверждено':item.status}</Text>
        </TouchableOpacity>
      )}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: theme.colors.bg, padding: 16 },
  card: { backgroundColor: theme.colors.surface, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, padding: 16, marginBottom: 12 },
  title: { color: theme.colors.text, fontWeight: '700' },
  sub: { color: theme.colors.textSubtle, marginTop: 4 },
  badge: { marginTop: 8, color: theme.colors.success, fontWeight: '700' },
});

