import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '../../../lib/supabase';
import { useBookingStatus } from '../../../hooks/useBookingStatus';
import { issueTicket } from '../../../lib/tickets';


export default function OrderDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const bookingId = (params.id || '') as string;
  const { status, isLoading: statusLoading, error: statusError } = useBookingStatus(bookingId);
  const [info, setInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [ticketToken, setTicketToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    const load = async () => {
      if (!supabase || !bookingId) return;
      setLoading(true);
      setError(undefined);
      try {
        const { data, error: qErr } = await supabase
          .from('bookings')
          .select(`
            id, created_at, status, total_price,
            tour:tour_id ( name ),
            order_items ( quantity, price )
          `)
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

  const onIssueTicket = async () => {
    try {
      const r = await issueTicket(bookingId);
      setTicketToken(r.token);
    } catch (e: any) {
      setError(e?.message || 'Не удалось выпустить билет');
    }
  };

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
      <View style={{ gap: 12 }}>
        <Text style={styles.item}>ID: {info.id}</Text>
        <Text style={styles.item}>Дата: {new Date(info.created_at).toLocaleString()}</Text>
        <Text style={styles.item}>Сумма: {info.total_price ?? '—'} ₽</Text>
        <Text style={styles.item}>Статус (live): {statusLoading ? '…' : (status || info.status)}</Text>
        {info.tour?.name && <Text style={styles.item}>Тур: {info.tour.name}</Text>}
        {Array.isArray(info.order_items) && info.order_items.length > 0 && (
          <View>
            <Text style={[styles.item, { fontWeight: '700', marginTop: 8 }]}>Услуги:</Text>
            {info.order_items.map((it: any, idx: number) => (
              <Text key={idx} style={styles.item}>- {it.quantity} × {it.price} ₽</Text>
            ))}
          </View>
        )}
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
        <View style={styles.body}>
          {renderBody()}
          {status === 'paid' && (
            <View style={{ marginTop: 16, gap: 8 }}>
              {!ticketToken ? (
                <TouchableOpacity onPress={onIssueTicket} style={styles.btn}>
                  <Text style={styles.btnText}>Получить QR-билет</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.ticketBox}>
                  <Text style={styles.ticketLabel}>QR токен:</Text>
                  <Text selectable style={styles.ticketToken}>{ticketToken}</Text>
                  <Text style={styles.info}>Покажите этот код контролёру (демо)</Text>
                </View>
              )}
            </View>
          )}
        </View>
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
  btn: { backgroundColor: '#0891b2', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
  ticketBox: { padding: 12, borderRadius: 10, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0' },
  ticketLabel: { color: '#334155', marginBottom: 6 },
  ticketToken: { color: '#0f172a', fontFamily: 'monospace' },
});

