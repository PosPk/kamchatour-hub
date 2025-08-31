import React from 'react';
import { SafeAreaView, View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBookingStatus } from '../../hooks/useBookingStatus';

export default function PaymentStatusScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ bookingId?: string; initial?: string }>();
  const bookingId = (params?.bookingId || params?.id || '') as string;
  const initial = (params?.initial || '') as string;

  const { status, isLoading, error } = useBookingStatus(bookingId);

  const effectiveStatus = status || initial;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Статус оплаты</Text>
      {!bookingId ? (
        <Text style={styles.error}>Не передан идентификатор заказа</Text>
      ) : isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#0891b2" />
          <Text style={styles.muted}>Проверяем оплату заказа #{bookingId.slice(0, 8)}…</Text>
        </View>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <View style={styles.card}>
          <Text style={[styles.status, effectiveStatus === 'paid' ? styles.ok : styles.fail]}>
            {effectiveStatus === 'paid' ? 'Оплата получена' : effectiveStatus || 'Ожидание'}
          </Text>
          <Text style={styles.muted}>Заказ #{bookingId.slice(0, 8)}</Text>
        </View>
      )}
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.btn}>
          <Text style={styles.btnText}>На главный</Text>
        </TouchableOpacity>
        {!!bookingId && (
          <TouchableOpacity onPress={() => router.push('/profile/orders')} style={[styles.btn, styles.btnOutline]}>
            <Text style={[styles.btnText, styles.btnTextOutline]}>Мои заказы</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 12 },
  center: { alignItems: 'center', gap: 8 },
  muted: { color: '#6b7280', marginTop: 8 },
  error: { color: '#ef4444' },
  card: { padding: 16, borderRadius: 12, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e5e7eb', gap: 8 },
  status: { fontSize: 18, fontWeight: '600' },
  ok: { color: '#16a34a' },
  fail: { color: '#dc2626' },
  actions: { marginTop: 24, flexDirection: 'row', gap: 12 },
  btn: { backgroundColor: '#0891b2', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
  btnText: { color: '#fff', fontWeight: '600' },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#0891b2' },
  btnTextOutline: { color: '#0891b2' },
});

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBookingStatus } from '../../hooks/useBookingStatus';

export default function PaymentStatusScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ booking_id?: string }>();
  const bookingId = (params.booking_id || '') as string;
  const { status, isLoading, error } = useBookingStatus(bookingId);

  useEffect(() => {
    // no-op: the hook handles realtime + polling
  }, [bookingId]);

  const handleReturn = () => {
    try {
      // Try deeplink first (scheme registered in app.json as "kamchatka")
      Linking.openURL('kamchatka://');
    } catch {}
    router.replace('/');
  };

  const renderStatus = () => {
    if (!bookingId) {
      return <Text style={styles.info}>Не передан booking_id</Text>;
    }
    if (isLoading) {
      return (
        <View style={styles.center}> 
          <ActivityIndicator color="#0891b2" />
          <Text style={styles.info}>Проверяем статус платежа…</Text>
        </View>
      );
    }
    if (error) {
      return <Text style={styles.error}>Ошибка: {error}</Text>;
    }
    if (status === 'paid' || status === 'succeeded') {
      return <Text style={styles.success}>Оплата прошла успешно</Text>;
    }
    if (status === 'payment_failed' || status === 'failed') {
      return <Text style={styles.failed}>Оплата не удалась</Text>;
    }
    return <Text style={styles.info}>Статус: {status || 'неизвестен'}</Text>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Статус оплаты</Text>
        <Text style={styles.sub}>Заказ #{bookingId || '—'}</Text>
      </View>
      <View style={styles.body}>{renderStatus()}</View>
      <View style={styles.footer}>
        <Button title="Вернуться в приложение" onPress={handleReturn} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 20, backgroundColor: '#0891b2', alignItems: 'center' },
  title: { color: '#fff', fontSize: 22, fontWeight: '700' },
  sub: { color: '#e0f2fe', marginTop: 6 },
  body: { flex: 1, padding: 20, justifyContent: 'center' },
  footer: { padding: 20 },
  center: { alignItems: 'center', gap: 12 },
  info: { color: '#334155', textAlign: 'center', marginTop: 12 },
  success: { color: '#10b981', fontWeight: '700', textAlign: 'center', fontSize: 16 },
  failed: { color: '#ef4444', fontWeight: '700', textAlign: 'center', fontSize: 16 },
  error: { color: '#ef4444', textAlign: 'center' },
});

