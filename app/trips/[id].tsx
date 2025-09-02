import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getBooking, Booking } from '../../lib/bookings';
import { theme } from '../../lib/theme';

export default function TripDetail(){
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<Booking | null>(null);
  const [qrHtml, setQrHtml] = useState<React.ReactNode | null>(null);
  useEffect(()=>{ (async()=>{ if(!id) return; setItem(await getBooking(String(id))); })(); },[id]);
  useEffect(()=>{
    (async()=>{
      if (Platform.OS === 'web' && item?.voucherCode) {
        try {
          const mod = await import('qrcode.react');
          const QRComp: any = (mod as any).QRCodeCanvas || (mod as any).QRCodeSVG || (mod as any).default;
          if (QRComp) {
            setQrHtml(React.createElement(QRComp, { value: item.voucherCode, size: 132 }));
          } else {
            setQrHtml(null);
          }
        } catch { setQrHtml(null); }
      } else {
        setQrHtml(null);
      }
    })();
  }, [item?.voucherCode]);
  if(!item) return <View style={styles.container}><Text>Загрузка…</Text></View>;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.sub}>{item.operatorName} • {new Date(item.dateFrom).toLocaleDateString('ru-RU')}</Text>

      <View style={styles.card}>
        <Text style={styles.section}>Ваучер</Text>
        <View style={styles.voucherBox}>
          {Platform.OS === 'web' ? (
            qrHtml ?? <Text style={styles.voucherText}>{item.voucherCode}</Text>
          ) : (
            <Text style={styles.voucherText}>{item.voucherCode}</Text>
          )}
        </View>
        <Text style={styles.hint}>Покажите код на месте встречи</Text>
      </View>

      {item.meetingPoint && (
        <View style={styles.card}>
          <Text style={styles.section}>Место встречи</Text>
          <Text style={styles.meta}>{item.meetingPoint.name}</Text>
          <Text style={styles.meta}>{item.meetingPoint.latitude.toFixed(4)}, {item.meetingPoint.longitude.toFixed(4)}</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.section}>Документы</Text>
        {item.documents.map((d,i)=>(<Text key={i} style={styles.link}>{d.name}</Text>))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: theme.colors.bg, padding: 16 },
  title: { color: theme.colors.text, fontWeight: '800', fontSize: 18 },
  sub: { color: theme.colors.textSubtle, marginTop: 4 },
  card: { backgroundColor: theme.colors.surface, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, padding: 16, marginTop: 12 },
  section: { fontWeight: '700', color: theme.colors.text, marginBottom: 8 },
  voucherBox: { borderWidth: 1, borderStyle: 'dashed', borderColor: theme.colors.primary, borderRadius: 12, padding: 16, alignItems: 'center' },
  voucherText: { fontWeight: '800', letterSpacing: 2, color: theme.colors.primaryDark },
  hint: { color: theme.colors.textSubtle, marginTop: 8 },
  meta: { color: theme.colors.text },
  link: { color: '#2563eb', marginTop: 4, textDecorationLine: 'underline' },
});

