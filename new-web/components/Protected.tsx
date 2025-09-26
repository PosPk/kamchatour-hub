import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'expo-router';

export default function Protected(props: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  if (user) return <>{props.children}</>;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Требуется вход</Text>
      <Text style={styles.text}>Авторизуйтесь, чтобы продолжить.</Text>
      <TouchableOpacity style={styles.btn} onPress={() => router.push('/auth')}>
        <Text style={styles.btnText}>Войти</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  text: { color: '#475569', marginBottom: 12 },
  btn: { backgroundColor: '#0891b2', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  btnText: { color: '#fff', fontWeight: '700' },
});

