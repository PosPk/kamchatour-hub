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

