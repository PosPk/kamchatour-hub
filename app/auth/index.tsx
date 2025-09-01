import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AuthIndex() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Экран аутентификации (в разработке)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { color: '#334155' }
});

