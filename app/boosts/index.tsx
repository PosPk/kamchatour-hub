import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBoosts } from '../../hooks/useBoosts';

export default function BoostsScreen() {
  const { boosts, toggleBoost, deactivateAll } = useBoosts();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Бусты и скидки</Text>
          {boosts.some(b => b.active) && (
            <TouchableOpacity style={styles.clearButton} onPress={deactivateAll}>
              <Text style={styles.clearText}>Выключить все</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.list}>
          {boosts.map(b => (
            <View key={b.id} style={styles.item}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{b.title}</Text>
                {!!b.description && <Text style={styles.desc}>{b.description}</Text>}
              </View>
              <Switch value={b.active} onValueChange={() => toggleBoost(b.id)} trackColor={{ false: '#e2e8f0', true: '#0891b2' }} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollView: { flex: 1 },
  header: { padding: 20, backgroundColor: '#0891b2', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  clearButton: { position: 'absolute', right: 20, top: 20 },
  clearText: { color: '#e0f2fe', fontSize: 14 },
  list: { padding: 20, gap: 12 },
  item: { backgroundColor: '#fff', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  desc: { fontSize: 14, color: '#64748b', marginTop: 2 },
});

