import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityCard } from '../../components/ui/ActivityCard';

interface Activity { id: string; title: string; short_desc?: string; image?: string; price?: number; currency?: string; difficulty?: string; duration?: string; tags?: string[]; season?: string; }

export default function ActivitiesScreen() {
  const [q, setQ] = useState('');
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    setLoading(true); setError(undefined);
    try {
      const r = await fetch(`/api/activities/list?q=${encodeURIComponent(q)}`);
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'load failed');
      setItems(j.items || []);
    } catch (e: any) {
      setError(e?.message || 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => { load(); }, [load]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Активности</Text></View>
      <View style={styles.controls}>
        <TextInput placeholder="Поиск активностей" value={q} onChangeText={setQ} onSubmitEditing={load} style={styles.input} />
      </View>
      {loading && <ActivityIndicator color="#0891b2" style={{ marginTop: 12 }} />}
      {error && <Text style={styles.error}>{error}</Text>}
      <ScrollView style={styles.list} contentContainerStyle={{ padding: 16 }}>
        {items.map(a => (
          <ActivityCard key={a.id} title={a.title} short={a.short_desc} image={a.image} price={a.price} currency={a.currency} badges={[a.difficulty || '', a.duration || '', ...(a.tags || [])].filter(Boolean)} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 20, backgroundColor: '#0891b2', alignItems: 'center' },
  title: { color:'#fff', fontSize:22, fontWeight:'700' },
  controls: { padding: 16, backgroundColor:'#fff' },
  input: { backgroundColor:'#f1f5f9', borderRadius:8, paddingHorizontal:12, height:40 },
  list: { flex: 1 },
  error: { color:'#ef4444', textAlign:'center', marginTop: 12 },
});

