import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmergencyIndex() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Экстренные функции (в разработке)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { color: '#334155' }
});

