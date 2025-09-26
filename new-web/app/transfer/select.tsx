import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { getTrip, holdSeats, bookHold } from '../../lib/transfer';

type SeatStatus = 'free' | 'hold' | 'booked' | 'blocked';

export default function SeatSelect() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [trip, setTrip] = useState<any>();
  const [seats, setSeats] = useState<Record<string, SeatStatus>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [holdInfo, setHoldInfo] = useState<{ hold_id: string; expires_at: string } | null>(null);
  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        setLoading(true);
        const { trip, seats } = await getTrip(id);
        setTrip(trip);
        const map: Record<string, SeatStatus> = {};
        for (const s of seats) map[s.seat_id] = s.status as SeatStatus;
        setSeats(map);
      } catch (e: any) {
        setError(e?.message || 'Ошибка загрузки рейса');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    let timer: any;
    if (holdInfo) {
      const tick = () => {
        const remain = Math.max(0, Math.floor((new Date(holdInfo.expires_at).getTime() - Date.now()) / 1000));
        setCountdown(remain);
        if (remain > 0) timer = setTimeout(tick, 1000);
      };
      tick();
    }
    return () => { if (timer) clearTimeout(timer); };
  }, [holdInfo]);

  const seatIds = useMemo(() => Object.keys(seats).sort(), [seats]);

  const toggleSeat = (sid: string) => {
    if (seats[sid] !== 'free') return;
    setSelected(prev => prev.includes(sid) ? prev.filter(x => x !== sid) : [...prev, sid]);
  };

  const startHold = async () => {
    if (!id || selected.length === 0) return;
    const info = await holdSeats(id, selected, 15);
    setHoldInfo(info);
  };

  const confirmBooking = async () => {
    if (!holdInfo) return;
    const r = await bookHold(holdInfo.hold_id);
    setSelected([]);
    alert(`Бронирование создано: ${r.booking_id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Выбор мест</Text>
      {loading && <ActivityIndicator color="#0891b2" />}
      {error && <Text style={styles.error}>{error}</Text>}
      {trip && (
        <View style={styles.info}> 
          <Text style={styles.sub}>Рейс: {trip.id.slice(0,8)} · {new Date(trip.depart_at).toLocaleString()}</Text>
          {holdInfo && (
            <View style={styles.holdBox}>
              <View style={[styles.progress, { width: `${Math.max(0, Math.min(100, (countdown/900)*100))}%` }]} />
              <Text style={styles.hold}>Удержание: {countdown}s</Text>
            </View>
          )}
        </View>
      )}
      <View style={styles.legend}>
        <Text style={styles.legendItem}>Свободно</Text>
        <View style={[styles.legendSwatch, { backgroundColor: '#e2e8f0' }]} />
        <Text style={styles.legendItem}>Занято</Text>
        <View style={[styles.legendSwatch, { backgroundColor: '#cbd5e1' }]} />
        <Text style={styles.legendItem}>Выбрано</Text>
        <View style={[styles.legendSwatch, { backgroundColor: '#0891b2' }]} />
      </View>
      <View style={styles.grid}>
        {seatIds.map(sid => (
          <TouchableOpacity key={sid} style={[styles.seat, 
            seats[sid] !== 'free' && styles.seatBusy,
            selected.includes(sid) && styles.seatSelected]} onPress={() => toggleSeat(sid)}>
            <Text style={styles.seatText}>{sid}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btn, selected.length === 0 && styles.btnDisabled]} disabled={selected.length === 0} onPress={startHold}>
          <Text style={styles.btnText}>Удержать ({selected.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnPrimary, !holdInfo && styles.btnDisabled]} disabled={!holdInfo} onPress={confirmBooking}>
          <Text style={styles.btnPrimaryText}>Забронировать</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  error: { color: '#ef4444', marginVertical: 8 },
  info: { marginBottom: 8 },
  sub: { color: '#64748b' },
  hold: { color: '#ef4444', fontWeight: '700', marginTop: 4 },
  holdBox: { marginTop: 4 },
  progress: { height: 4, backgroundColor: '#0891b2', borderRadius: 2, marginBottom: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 12 },
  seat: { width: 56, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e2e8f0' },
  seatBusy: { backgroundColor: '#cbd5e1' },
  seatSelected: { backgroundColor: '#0891b2' },
  seatText: { color: '#0f172a', fontWeight: '700' },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendItem: { color: '#64748b', fontSize: 12 },
  legendSwatch: { width: 16, height: 12, borderRadius: 2 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  btn: { backgroundColor: '#334155', borderRadius: 8, paddingHorizontal: 16, height: 40, alignItems:'center', justifyContent:'center' },
  btnText: { color: '#fff', fontWeight: '700' },
  btnPrimary: { backgroundColor: '#0891b2', borderRadius: 8, paddingHorizontal: 16, height: 40, alignItems:'center', justifyContent:'center' },
  btnPrimaryText: { color: '#fff', fontWeight: '700' },
  btnDisabled: { opacity: 0.5 },
});

