import React, { useMemo, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Switch } from 'react-native';
import { getMockSearchResults } from '../src/services/search';
import { formatMoney } from '../src/utils/money';

export default function Results() {
  const params = useLocalSearchParams();
  const { where = 'Москва', checkIn = '2025-10-01', checkOut = '2025-10-03', guests = '2' } = params;
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('4.5');
  const [onlyFreeCancel, setOnlyFreeCancel] = useState(true);

  const items = useMemo(() => getMockSearchResults({
    where: String(where),
    checkIn: String(checkIn),
    checkOut: String(checkOut),
    guests: Number(guests) || 1,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    minRating: minRating ? Number(minRating) : undefined,
    onlyFreeCancel
  }), [where, checkIn, checkOut, guests, minPrice, maxPrice, minRating, onlyFreeCancel]);

  const openListing = (id) => router.push({ pathname: `/listing/${id}`, params: { checkIn, checkOut, guests } });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Найдено: {items.length} — {where}</Text>
      <View style={styles.filters}>
        <TextInput placeholder="Мин. цена" placeholderTextColor="#64748b" value={minPrice} onChangeText={setMinPrice} keyboardType="numeric" style={[styles.input, { flex: 1, marginRight: 6 }]} />
        <TextInput placeholder="Макс. цена" placeholderTextColor="#64748b" value={maxPrice} onChangeText={setMaxPrice} keyboardType="numeric" style={[styles.input, { flex: 1, marginLeft: 6 }]} />
      </View>
      <View style={styles.filtersRow}>
        <TextInput placeholder="Мин. рейтинг (4.5)" placeholderTextColor="#64748b" value={minRating} onChangeText={setMinRating} keyboardType="decimal-pad" style={[styles.input, { flex: 1, marginRight: 12 }]} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.meta}>Бесплатная отмена</Text>
          <Switch value={onlyFreeCancel} onValueChange={setOnlyFreeCancel} />
        </View>
      </View>
      <FlatList
        data={items}
        keyExtractor={(x) => x.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => openListing(item.id)} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.meta}>Рейтинг {item.rating.toFixed(1)} · {item.reviews} отзывов</Text>
              <Text style={styles.meta}>{item.freeCancel ? 'Бесплатная отмена' : 'Условия отмены ограничены'} · Оплата онлайн</Text>
            </View>
            <Text style={styles.price}>{formatMoney(item.priceRub)}/ночь</Text>
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
  filters: { flexDirection: 'row', marginBottom: 8 },
  filtersRow: { flexDirection: 'row', marginBottom: 8, alignItems: 'center', justifyContent: 'space-between' },
  input: { backgroundColor: '#0f172a', borderColor: '#1f2937', borderWidth: 1, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, color: '#e5e7eb' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111827', borderColor: '#1f2937', borderWidth: 1, borderRadius: 12, padding: 12 },
  title: { color: '#e5e7eb', fontWeight: '700', marginBottom: 4 },
  meta: { color: '#94a3b8', fontSize: 12 },
  price: { color: '#34d399', fontWeight: '700', marginLeft: 12 }
});

