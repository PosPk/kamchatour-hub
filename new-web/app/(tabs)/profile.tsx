import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen(){
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 16 }}>
        <Text style={styles.title}>Профиль</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#f8fafc' },
  title: { color:'#111827', fontWeight:'800', fontSize: 18 }
});