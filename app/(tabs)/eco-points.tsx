import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EcoAction, EcoBalance, getEcoBalance, listEcoActions } from '../../lib/ecopoints';

export default function EcoPointsScreen() {
  const [balance, setBalance] = useState<EcoBalance | null>(null);
  const [actions, setActions] = useState<EcoAction[]>([]);

  useEffect(() => {
    (async () => {
      const [b, a] = await Promise.all([getEcoBalance(), listEcoActions()]);
      setBalance(b);
      setActions(a);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>ЭкоБаллы</Text>
        <View style={styles.rowBetween}>
          <View style={styles.rowCenter}>
            <Ionicons name="leaf" size={24} color="#047857" />
            <Text style={styles.points}>{balance?.total ?? 0}</Text>
          </View>
          <Text>Уровень {balance?.level ?? 1} • След. на {balance?.nextLevelAt ?? 100}</Text>
        </View>
      </View>

      <Text style={styles.section}>История действий</Text>
      <FlatList
        data={actions}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.rowCenter}>
              <Ionicons name={item.verified ? 'checkmark-circle' : 'time'} size={18} color={item.verified ? '#059669' : '#64748b'} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </View>
            <Text style={styles.itemPoints}>+{item.points}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.cta}>
        <Text style={styles.ctaText}>Добавить действие</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  points: { marginLeft: 8, fontSize: 20, fontWeight: '800', color: '#064e3b' },
  section: { fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 8 },
  itemTitle: { marginLeft: 8, color: '#334155' },
  itemPoints: { color: '#065f46', fontWeight: '700' },
  cta: { backgroundColor: '#10b981', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  ctaText: { color: '#fff', fontWeight: '700' },
});

