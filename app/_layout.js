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
        {/* Жильё (legacy) */}
        <Stack.Screen name="results" options={{ title: 'Результаты (жильё)' }} />
        <Stack.Screen name="listing/[id]" options={{ title: 'Объект' }} />
        <Stack.Screen name="checkout" options={{ title: 'Оформление' }} />
        <Stack.Screen name="confirm" options={{ title: 'Подтверждение' }} />
        {/* Активности */}
        <Stack.Screen name="activities/results" options={{ title: 'Активности' }} />
        <Stack.Screen name="activities/[id]" options={{ title: 'Активность' }} />
        <Stack.Screen name="activities/checkout" options={{ title: 'Оформление активности' }} />
        <Stack.Screen name="activities/confirm" options={{ title: 'Подтверждение' }} />
        {/* Трансфер */}
        <Stack.Screen name="transfers/results" options={{ title: 'Трансфер' }} />
        <Stack.Screen name="transfers/checkout" options={{ title: 'Оформление трансфера' }} />
        <Stack.Screen name="transfers/confirm" options={{ title: 'Подтверждение' }} />
      </Stack>
    </>
  );
}

