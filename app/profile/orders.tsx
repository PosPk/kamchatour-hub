import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function OrdersScreen(){
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Мои заказы</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#f8fafc', padding: 16 },
  title: { color:'#111827', fontWeight:'800', fontSize: 18 }
});

