import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoles } from '../../contexts/RoleContext';
import { useRouter } from 'expo-router';

export default function TransferCabinet() {
  const { hasRole } = useRoles();
  const router = useRouter();
  if (!hasRole('transfer')) return <View style={styles.center}><Text>Нет доступа</Text></View>;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Кабинет трансфера</Text>
      <TouchableOpacity style={styles.btn} onPress={() => router.push('/transfer/list')}>
        <Text style={styles.btnText}>Рейсы на сегодня</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  center: { flex:1, alignItems:'center', justifyContent:'center' },
  btn: { backgroundColor: '#0891b2', borderRadius: 8, paddingHorizontal: 16, height: 40, alignItems:'center', justifyContent:'center', width: 220 },
  btnText: { color: '#fff', fontWeight: '700' },
});

