import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Health = { ok: boolean; service?: string; version?: string; uptimeMs?: number; env?: any; now?: string };
type EnvCheck = { ok: boolean; supabase: boolean; payments: boolean; ai: string; bugsnag: boolean; axiom: boolean };

export default function EnvScreen() {
  const [health, setHealth] = useState<Health | null>(null);
  const [env, setEnv] = useState<EnvCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const load = async () => {
    setLoading(true); setError(undefined);
    try {
      const [hr, er] = await Promise.all([
        fetch('/api/health'),
        fetch('/api/env'),
      ]);
      const hj = await hr.json();
      const ej = await er.json();
      if (!hr.ok) throw new Error(hj?.error || 'health failed');
      if (!er.ok) throw new Error(ej?.error || 'env failed');
      setHealth(hj);
      setEnv(ej);
    } catch (e: any) {
      setError(e?.message || 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const Line = ({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) => (
    <View style={styles.row}><Text style={styles.label}>{label}</Text><Text style={[styles.value, danger && styles.danger]}>{value}</Text></View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Окружение и статус</Text>
        <TouchableOpacity onPress={load} style={styles.refresh}><Text style={styles.refreshText}>Обновить</Text></TouchableOpacity>
        {loading && <ActivityIndicator color="#0891b2" style={{ marginTop: 12 }} />}
        {error && <Text style={styles.error}>{error}</Text>}
        {health && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Health</Text>
            <Line label="Service" value={String(health.service || '—')} />
            <Line label="Version" value={String(health.version || '—')} />
            <Line label="Uptime" value={`${Math.floor((health.uptimeMs || 0)/1000)}s`} />
            <Line label="Now" value={String(health.now || '—')} />
          </View>
        )}
        {env && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>ENV</Text>
            <Line label="Supabase" value={env.supabase ? 'OK' : 'MISSING'} danger={!env.supabase} />
            <Line label="Payments" value={env.payments ? 'OK' : 'MISSING'} danger={!env.payments} />
            <Line label="AI Provider" value={env.ai} />
            <Line label="Bugsnag" value={env.bugsnag ? 'ON' : 'OFF'} danger={!env.bugsnag} />
            <Line label="Axiom" value={env.axiom ? 'ON' : 'OFF'} danger={!env.axiom} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  refresh: { alignSelf: 'flex-start', marginTop: 8, backgroundColor: '#0891b2', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  refreshText: { color: '#fff', fontWeight: '700' },
  error: { color: '#ef4444', marginTop: 12 },
  card: { backgroundColor:'#fff', borderRadius:12, padding: 12, marginTop: 16, borderWidth:1, borderColor:'#e2e8f0' },
  cardTitle: { fontWeight: '700', color:'#0f172a', marginBottom: 8 },
  row: { flexDirection:'row', justifyContent:'space-between', paddingVertical: 6 },
  label: { color:'#334155' },
  value: { color:'#0f172a', fontWeight:'600' },
  danger: { color:'#dc2626' },
});

import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EnvScreen() {
  const [health, setHealth] = useState<string>('не проверено');
  const baseUrl = process.env.EXPO_PUBLIC_API_URL || '—';
  const env = process.env.EXPO_PUBLIC_ENV || '—';

  const checkHealth = useCallback(async () => {
    try {
      const start = Date.now();
      const res = await fetch(`${baseUrl}/health`);
      const ms = Date.now() - start;
      const body = await res.text();
      setHealth(`${res.status} • ${ms}мс • ${body.slice(0, 80)}`);
    } catch {
      setHealth('ошибка запроса');
    }
  }, [baseUrl]);

  useEffect(() => { if (baseUrl && baseUrl !== '—') checkHealth(); }, [baseUrl, checkHealth]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Проверка окружения</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.item}><Text style={styles.label}>ENV:</Text> {env}</Text>
          <Text style={styles.item}><Text style={styles.label}>API URL:</Text> {baseUrl}</Text>
          <Text style={styles.item}><Text style={styles.label}>/health:</Text> {health}</Text>
          <TouchableOpacity style={styles.btn} onPress={checkHealth}>
            <Text style={styles.btnText}>Проверить снова</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { flex: 1 },
  header: { padding: 20, backgroundColor: '#0891b2', alignItems: 'center' },
  headerTitle: { color:'#fff', fontSize:22, fontWeight:'700' },
  body: { padding: 20, gap: 10 },
  item: { fontSize: 14, color:'#334155' },
  label: { fontWeight: '700', color:'#1e293b' },
  btn: { marginTop: 12, backgroundColor:'#0891b2', borderRadius: 8, paddingVertical:10, alignItems:'center' },
  btnText: { color:'#fff', fontWeight:'700' },
});

