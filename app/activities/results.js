import React, { useMemo, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Switch } from 'react-native';
import { getMockActivities } from '../../src/services/activities';
import { formatMoney } from '../../src/utils/money';

export default function ActivitiesResults() {
  const { where = 'Москва', date = '2025-10-01', people = '2' } = useLocalSearchParams();
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('4.5');
  const [onlyInstant, setOnlyInstant] = useState(true);

  const items = useMemo(() => getMockActivities({
    where: String(where), date: String(date), people: Number(people) || 1,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    minRating: minRating ? Number(minRating) : undefined,
    onlyInstant
  }), [where, date, people, minPrice, maxPrice, minRating, onlyInstant]);

  const open = (id) => router.push({ pathname: `/activities/${id}`, params: { date, people } });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Активности — {where}</Text>
      <View style={styles.filtersRow}>
        <TextInput placeholder="Мин. цена" placeholderTextColor="#64748b" value={minPrice} onChangeText={setMinPrice} keyboardType="numeric" style={[styles.input, { flex: 1, marginRight: 6 }]} />
        <TextInput placeholder="Макс. цена" placeholderTextColor="#64748b" value={maxPrice} onChangeText={setMaxPrice} keyboardType="numeric" style={[styles.input, { flex: 1, marginLeft: 6 }]} />
      </View>
      <View style={styles.filtersRow}>
        <TextInput placeholder="Мин. рейтинг (4.5)" placeholderTextColor="#64748b" value={minRating} onChangeText={setMinRating} keyboardType="decimal-pad" style={[styles.input, { flex: 1, marginRight: 12 }]} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.meta}>Мгновенное подтверждение</Text>
          <Switch value={onlyInstant} onValueChange={setOnlyInstant} />
        </View>
      </View>
      <FlatList
        data={items}
        keyExtractor={(x) => x.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => open(item.id)} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.meta}>Рейтинг {item.rating.toFixed(1)} · {item.reviews} отзывов</Text>
              <Text style={styles.meta}>{item.instant ? 'Мгновенное подтверждение' : 'Подтверждение в течение 24 часов'}</Text>
            </View>
            <Text style={styles.price}>{formatMoney(item.priceRub)}/чел</Text>
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

