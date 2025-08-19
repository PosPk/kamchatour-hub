import React from 'react';
import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function NotFound() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Страница не найдена</Text>
      <Text style={styles.meta}>Похоже, такой страницы нет или она была перемещена.</Text>
      <Link href="/" style={styles.link}>На главную</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#0b1220' },
  title: { color: '#e5e7eb', fontWeight: '700', fontSize: 20, marginBottom: 6 },
  meta: { color: '#94a3b8', fontSize: 13, marginBottom: 10 },
  link: { color: '#93c5fd', fontWeight: '700' }
});

