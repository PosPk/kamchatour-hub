import React from 'react';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: 'Главная' }} />
      <Stack.Screen name="innovations/index" options={{ title: 'Передовые идеи' }} />
    </Stack>
  );
}

