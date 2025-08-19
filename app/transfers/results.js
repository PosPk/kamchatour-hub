import React, { useMemo, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Switch } from 'react-native';
import { getMockTransfers } from '../../src/services/transfers';
import { formatMoney } from '../../src/utils/money';

export default function TransfersResults() {
  const { from = 'Москва', to = 'Аэропорт', date = '2025-10-01', people = '2' } = useLocalSearchParams();
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [onlyFreeCancel, setOnlyFreeCancel] = useState(true);

  const items = useMemo(() => getMockTransfers({
    from: String(from), to: String(to), date: String(date), people: Number(people) || 1,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    onlyFreeCancel
  }), [from, to, date, people, minPrice, maxPrice, onlyFreeCancel]);

  const goCheckout = (id) => router.push({ pathname: '/transfers/checkout', params: { id, from, to, date, people } });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Трансфер — {from} → {to}</Text>
      <View style={styles.filtersRow}>
        <TextInput placeholder="Мин. цена" placeholderTextColor="#64748b" value={minPrice} onChangeText={setMinPrice} keyboardType="numeric" style={[styles.input, { flex: 1, marginRight: 6 }]} />
        <TextInput placeholder="Макс. цена" placeholderTextColor="#64748b" value={maxPrice} onChangeText={setMaxPrice} keyboardType="numeric" style={[styles.input, { flex: 1, marginLeft: 6 }]} />
      </View>
      <View style={styles.filtersRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.meta}>Бесплатная отмена</Text>
          <Switch value={onlyFreeCancel} onValueChange={setOnlyFreeCancel} />
        </View>
      </View>
      <FlatList
        data={items}
        keyExtractor={(x) => x.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => goCheckout(item.id)} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.vehicle} · {item.capacity} мест</Text>
              <Text style={styles.meta}>{item.company} · {item.freeCancel ? 'Бесплатная отмена' : 'Ограниченные условия'}</Text>
              <Text style={styles.meta}>Ожидание водителя: {item.waitMinutes} мин</Text>
            </View>
            <Text style={styles.price}>{formatMoney(item.priceRub)}</Text>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#0b1220' },
  header: { color: '#e5e7eb', marginBottom: 8, fontWeight: '600' },
  filtersRow: { flexDirection: 'row', marginBottom: 8, alignItems: 'center', justifyContent: 'space-between' },
  input: { backgroundColor: '#0f172a', borderColor: '#1f2937', borderWidth: 1, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, color: '#e5e7eb' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111827', borderColor: '#1f2937', borderWidth: 1, borderRadius: 12, padding: 12 },
  title: { color: '#e5e7eb', fontWeight: '700', marginBottom: 4 },
  meta: { color: '#94a3b8', fontSize: 12 },
  price: { color: '#34d399', fontWeight: '700', marginLeft: 12 }
});

