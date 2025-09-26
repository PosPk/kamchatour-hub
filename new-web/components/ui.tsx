import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../lib/theme';

export function Card(props: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, props.style]}>{props.children}</View>;
}

export function Button(props: { title: string; onPress?: () => void; variant?: 'primary' | 'accent' | 'danger' | 'outline' }) {
  const v = props.variant ?? 'primary';
  return (
    <TouchableOpacity onPress={props.onPress} style={[styles.btn, v==='primary'&&styles.btnPrimary, v==='accent'&&styles.btnAccent, v==='danger'&&styles.btnDanger, v==='outline'&&styles.btnOutline]}>
      <Text style={[styles.btnText, v==='outline'&&{ color: theme.colors.primary }]}>{props.title}</Text>
    </TouchableOpacity>
  );
}

export function SectionTitle(props: { children: React.ReactNode }){
  return <Text style={styles.section}>{props.children}</Text>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border, padding: 16 },
  btn: { borderRadius: theme.radius.md, paddingVertical: 12, alignItems: 'center', borderWidth: 1 },
  btnPrimary: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  btnAccent: { backgroundColor: theme.colors.accent, borderColor: theme.colors.accent },
  btnDanger: { backgroundColor: theme.colors.danger, borderColor: theme.colors.danger },
  btnOutline: { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary },
  btnText: { color: '#fff', fontWeight: '700' },
  section: { fontWeight: '700', color: theme.colors.text, marginBottom: 8 },
});

