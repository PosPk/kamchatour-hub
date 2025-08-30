import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { track } from '../../lib/analytics';

const sampleTours = [
  { id: '1', title: 'Вулкан Мутновский', difficulty: 'medium', price: 8000, days: 1 },
  { id: '2', title: 'Долина гейзеров', difficulty: 'easy', price: 15000, days: 2 },
  { id: '3', title: 'Медвежье сафари', difficulty: 'easy', price: 12000, days: 1 },
];

export default function ToursCatalog() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [sort, setSort] = useState<'price_asc' | 'price_desc' | 'days_asc' | 'days_desc'>('price_asc');

  const filtered = useMemo(() => {
    track('search', { q: query });
    let list = sampleTours.filter(t =>
      t.title.toLowerCase().includes(query.toLowerCase()) && (difficulty === 'all' || t.difficulty === difficulty)
    );
    switch (sort) {
      case 'price_asc': list = list.sort((a, b) => a.price - b.price); break;
      case 'price_desc': list = list.sort((a, b) => b.price - a.price); break;
      case 'days_asc': list = list.sort((a, b) => a.days - b.days); break;
      case 'days_desc': list = list.sort((a, b) => b.days - a.days); break;
    }
    return list;
  }, [query, difficulty, sort]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Туры Камчатки</Text>
        </View>
        <View style={styles.filters}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#64748b" />
            <TextInput placeholder="Поиск туров" style={styles.input} value={query} onChangeText={setQuery} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
            {['all','easy','medium','hard'].map(d => (
              <TouchableOpacity key={d} style={[styles.chip, difficulty===d && styles.chipActive]} onPress={()=>setDifficulty(d as any)}>
                <Text style={[styles.chipText, difficulty===d && styles.chipTextActive]}>
                  {d==='all'?'Все': d==='easy'?'Легко': d==='medium'?'Средне':'Сложно'}
                </Text>
              </TouchableOpacity>
            ))}
            {[
              {k:'price_asc', n:'Цена ↑'},
              {k:'price_desc', n:'Цена ↓'},
              {k:'days_asc', n:'Дни ↑'},
              {k:'days_desc', n:'Дни ↓'},
            ].map(s => (
              <TouchableOpacity key={s.k} style={[styles.chip, sort===s.k && styles.chipActive]} onPress={()=>setSort(s.k as any)}>
                <Text style={[styles.chipText, sort===s.k && styles.chipTextActive]}>{s.n}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.list}>
          {filtered.map(t => (
            <TouchableOpacity key={t.id} style={styles.card} onPress={() => { track('view_item', { id: t.id }); router.push(`/tours/${t.id}`); }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{t.title}</Text>
                <Text style={styles.cardSub}>{t.days} дн • {t.difficulty} • {t.price} ₽</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </TouchableOpacity>
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
  title: { color: '#fff', fontSize: 22, fontWeight: '700' },
  filters: { padding: 20 },
  searchBar: { backgroundColor:'#fff', flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingVertical:12, borderRadius:12 },
  input: { marginLeft: 12, flex: 1 },
  chip: { backgroundColor:'#fff', paddingHorizontal:14, paddingVertical:8, borderRadius:20, marginRight:10 },
  chipActive: { backgroundColor:'#0891b2' },
  chipText: { color:'#64748b', fontWeight:'600' },
  chipTextActive: { color:'#fff' },
  list: { padding: 20, gap: 10 },
  card: { backgroundColor:'#fff', borderRadius:12, padding:16, flexDirection:'row', alignItems:'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: 16, fontWeight: '700', color:'#1e293b' },
  cardSub: { fontSize: 14, color:'#64748b', marginTop: 4 },
});

