import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen(){
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.title}>Камчатка</Text>
        <Text style={styles.sub}>Добро пожаловать!</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#f8fafc' },
  title: { fontSize: 22, fontWeight:'800', color:'#111827' },
  sub: { color:'#6b7280', marginTop: 6 }
});