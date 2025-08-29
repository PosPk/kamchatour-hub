import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { listOperators, Operator } from '../../lib/operators';
import { useRouter } from 'expo-router';

export default function OperatorsScreen() {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const data = await listOperators({ search });
      if (active) setItems(data);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [search]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#64748b" />
        <TextInput
          style={styles.input}
          placeholder="Поиск операторов..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/operator/${item.id}`)}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              {item.verified && (
                <View style={styles.badge}>
                  <Ionicons name="shield-checkmark" size={14} color="#047857" />
                  <Text style={styles.badgeText}>Проверен</Text>
                </View>
              )}
            </View>
            <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
            <View style={styles.meta}>
              <View style={styles.metaItem}>
                <Ionicons name="star" size={14} color="#f59e0b" />
                <Text style={styles.metaText}>{item.score ?? 0}</Text>
              </View>
              {item.activities?.length ? (
                <View style={styles.metaItem}>
                  <Ionicons name="trail-sign" size={14} color="#64748b" />
                  <Text style={styles.metaText}>{item.activities.slice(0,2).join(', ')}{item.activities.length>2?'…':''}</Text>
                </View>
              ) : null}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  input: { marginLeft: 8, flex: 1 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  cardDesc: { marginTop: 8, color: '#475569' },
  meta: { marginTop: 10, flexDirection: 'row', alignItems: 'center' },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  metaText: { marginLeft: 6, color: '#334155' },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ecfdf5', borderColor: '#10b981', borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9999 },
  badgeText: { marginLeft: 4, color: '#047857', fontSize: 12, fontWeight: '600' },
});

