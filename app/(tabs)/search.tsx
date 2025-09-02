import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { activities, regions, searchTours, Tour } from '../../lib/tours';

export default function SearchScreen() {
  const [q, setQ] = useState('');
  const [activity, setActivity] = useState<string | undefined>();
  const [region, setRegion] = useState<string | undefined>();
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [daysMin, setDaysMin] = useState<string>('');
  const [daysMax, setDaysMax] = useState<string>('');
  const [sort, setSort] = useState<'price-asc' | 'price-desc' | 'rating-desc' | 'duration-asc' | undefined>('rating-desc');
  const [items, setItems] = useState<Tour[]>([]);

  useEffect(() => {
    (async () => {
      const data = await searchTours({
        q,
        activity,
        region,
        priceMin: priceMin ? Number(priceMin) : undefined,
        priceMax: priceMax ? Number(priceMax) : undefined,
        daysMin: daysMin ? Number(daysMin) : undefined,
        daysMax: daysMax ? Number(daysMax) : undefined,
        sort,
      });
      setItems(data);
    })();
  }, [q, activity, region, priceMin, priceMax, daysMin, daysMax, sort]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.inputIconWrap}>
          <Ionicons name="search" size={18} color="#64748b" />
          <TextInput style={styles.input} placeholder="Что ищем?" value={q} onChangeText={setQ} />
        </View>
      </View>
      <View style={styles.row}>
        <ScrollChips items={activities} value={activity} onChange={setActivity} />
      </View>
      <View style={styles.row}>
        <ScrollChips items={regions} value={region} onChange={setRegion} />
      </View>
      <View style={styles.rowSplit}>
        <TextInput style={[styles.input, styles.inputSmall]} placeholder="Цена от" keyboardType='numeric' value={priceMin} onChangeText={setPriceMin} />
        <TextInput style={[styles.input, styles.inputSmall]} placeholder="Цена до" keyboardType='numeric' value={priceMax} onChangeText={setPriceMax} />
      </View>
      <View style={styles.rowSplit}>
        <TextInput style={[styles.input, styles.inputSmall]} placeholder="Дней от" keyboardType='numeric' value={daysMin} onChangeText={setDaysMin} />
        <TextInput style={[styles.input, styles.inputSmall]} placeholder="Дней до" keyboardType='numeric' value={daysMax} onChangeText={setDaysMax} />
      </View>
      <View style={styles.row}>
        <ScrollChips items={[
          { label: 'Сначала популярные', val: 'rating-desc' },
          { label: 'Дешевле', val: 'price-asc' },
          { label: 'Дороже', val: 'price-desc' },
          { label: 'Короче', val: 'duration-asc' },
        ]} value={sort} onChange={setSort} isObject />
      </View>

      <FlatList
        data={items}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => {/* TODO: router.push(`/tours/${item.id}`) */}}>
            {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.cover} /> : <View style={[styles.cover,{backgroundColor:'#e2e8f0'}]} />}
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardMeta}>{item.activity} • {item.region}</Text>
              <View style={styles.badges}>
                {!!item.rating && <View style={styles.badge}><Text style={styles.badgeText}>★ {item.rating.toFixed(1)}</Text></View>}
                <View style={styles.badge}><Text style={styles.badgeText}>{item.durationDays} дн.</Text></View>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.price}>{item.priceFrom.toLocaleString('ru-RU')} ₽</Text>
                <Text style={styles.days}>от оператора</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function ScrollChips(props: { items: string[] | { label: string; val: any }[]; value: any; onChange: (v: any) => void; isObject?: boolean }) {
  const { items, value, onChange, isObject } = props;
  return (
    <FlatList
      data={items as any[]}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(it: any, idx) => String(isObject ? it.val : it)}
      renderItem={({ item }) => {
        const val = isObject ? item.val : item;
        const label = isObject ? item.label : item;
        const active = value === val;
        return (
          <TouchableOpacity onPress={() => onChange(active ? undefined : val)} style={[styles.chip, active && styles.chipActive]}>
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  row: { marginBottom: 10 },
  rowSplit: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  inputIconWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  input: { marginLeft: 8, flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  inputSmall: { width: '48%' },
  chip: { backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: '#e2e8f0', marginRight: 8 },
  chipActive: { backgroundColor: '#e0f2fe', borderColor: '#38bdf8' },
  chipText: { color: '#334155' },
  chipTextActive: { color: '#0c4a6e', fontWeight: '700' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  cardBody: { paddingTop: 8 },
  cover: { width: '100%', height: 160, borderRadius: 10 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  cardMeta: { marginTop: 4, color: '#475569' },
  cardRow: { marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { color: '#065f46', fontWeight: '800' },
  days: { color: '#334155' },
  badges: { flexDirection: 'row', marginTop: 6 },
  badge: { backgroundColor: '#e0f2fe', borderColor: '#38bdf8', borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, marginRight: 8 },
  badgeText: { color: '#0c4a6e', fontWeight: '700', fontSize: 12 },
});

