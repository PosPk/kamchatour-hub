import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { createClient } from '@supabase/supabase-js';
import { useBookingStatus } from '../../../hooks/useBookingStatus';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string | undefined;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string | undefined;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default function OrderDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const bookingId = (params.id || '') as string;
  const { status, isLoading: statusLoading, error: statusError } = useBookingStatus(bookingId);
  const [info, setInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const load = async () => {
      if (!supabase || !bookingId) return;
      setLoading(true);
      setError(undefined);
      try {
        const { data, error: qErr } = await supabase
          .from('bookings')
          .select('id, created_at, status, total_price')
          .eq('id', bookingId)
          .single();
        if (qErr) throw qErr;
        setInfo(data);
      } catch (e: any) {
        setError(e?.message || 'Ошибка загрузки заказа');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [bookingId]);

  const renderBody = () => {
    if (loading) {
      return (
        <View style={styles.center}> 
          <ActivityIndicator color="#0891b2" />
          <Text style={styles.info}>Загрузка деталей заказа…</Text>
        </View>
      );
    }
    if (error) return <Text style={styles.error}>{error}</Text>;
    if (!info) return <Text style={styles.info}>Заказ не найден</Text>;

    return (
      <View style={{ gap: 8 }}>
        <Text style={styles.item}>ID: {info.id}</Text>
        <Text style={styles.item}>Дата: {new Date(info.created_at).toLocaleString()}</Text>
        <Text style={styles.item}>Сумма: {info.total_price ?? '—'} ₽</Text>
        <Text style={styles.item}>Статус (live): {statusLoading ? '…' : (status || info.status)}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Детали заказа</Text>
          <Text style={styles.sub}>Заказ #{bookingId}</Text>
          {statusError && <Text style={styles.error}>Ошибка статуса: {statusError}</Text>}
        </View>
        <View style={styles.body}>{renderBody()}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { flex: 1 },
  header: { padding: 20, backgroundColor: '#0891b2', alignItems: 'center' },
  title: { color:'#fff', fontSize:22, fontWeight:'700' },
  sub: { color:'#e0f2fe', marginTop: 6 },
  body: { padding: 20 },
  center: { alignItems: 'center', gap: 12 },
  info: { color: '#334155', textAlign: 'center' },
  error: { color: '#ef4444', textAlign: 'center' },
  item: { color: '#1e293b' },
});

