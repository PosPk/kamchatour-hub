import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { searchTrips, TripSummary } from '../../lib/transfer';

export default function TransferList() {
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().slice(0,10);
        const data = await searchTrips(today);
        setTrips(data);
      } catch (e: any) {
        setError(e?.message || 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Доступные рейсы</Text>
      {loading && <ActivityIndicator color="#0891b2" />}
      {error && <Text style={styles.error}>{error}</Text>}
      {trips.map(t => (
        <TouchableOpacity key={t.id} style={styles.card} onPress={() => router.push(`/transfer/select?id=${t.id}`)}>
          <Text style={styles.cardTitle}>Рейс #{t.id.slice(0,8)} — {new Date(t.depart_at).toLocaleString()}</Text>
          <Text style={styles.cardSub}>Статус: {t.status}</Text>
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  error: { color: '#ef4444', marginVertical: 8 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10 },
  cardTitle: { fontWeight: '700', color: '#0f172a' },
  cardSub: { color: '#64748b', marginTop: 4 },
});

