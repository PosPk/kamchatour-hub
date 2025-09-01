import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { onchainInitDeposit } from '../../lib/onchain';

export default function OperatorOnchainScreen(){
  const [bookingId, setBookingId] = useState('');
  const [operatorId, setOperatorId] = useState('op1');
  const [commission, setCommission] = useState('1000');
  const [penalty, setPenalty] = useState('2000');
  const [network, setNetwork] = useState<'solana-devnet'|'solana-mainnet'>('solana-devnet');

  const onInit = async () => {
    const payload = {
      bookingId,
      operatorId,
      commission: Number(commission),
      penalty: Number(penalty),
      network,
    };
    const res = await onchainInitDeposit(payload);
    Alert.alert('Депозит', `PDA: ${res.pda}\nTX: ${res.tx.slice(0,18)}...`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Гарантийный депозит (оператор)</Text>
      <TextInput style={styles.input} placeholder='bookingId' value={bookingId} onChangeText={setBookingId} />
      <TextInput style={styles.input} placeholder='operatorId' value={operatorId} onChangeText={setOperatorId} />
      <TextInput style={styles.input} placeholder='commission (minor units)' keyboardType='numeric' value={commission} onChangeText={setCommission} />
      <TextInput style={styles.input} placeholder='penalty (minor units)' keyboardType='numeric' value={penalty} onChangeText={setPenalty} />
      <TouchableOpacity style={styles.btn} onPress={onInit}><Text style={styles.btnText}>Инициировать депозит</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding: 16 },
  title: { fontWeight: '800', fontSize: 16, marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 8 },
  btn: { backgroundColor: '#0891b2', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
});

