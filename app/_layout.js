import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0b1220' },
          headerTintColor: '#e5e7eb',
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: '#0b1220' }
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Поиск' }} />
        <Stack.Screen name="results" options={{ title: 'Результаты' }} />
        <Stack.Screen name="listing/[id]" options={{ title: 'Объект' }} />
        <Stack.Screen name="checkout" options={{ title: 'Оформление' }} />
        <Stack.Screen name="confirm" options={{ title: 'Подтверждение' }} />
      </Stack>
    </>
  );
}

