import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../contexts/AuthContext';
import { LocationProvider } from '../contexts/LocationContext';
import { EmergencyProvider } from '../contexts/EmergencyContext';
import { ThemeProvider } from '../contexts/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LocationProvider>
          <EmergencyProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="auth" options={{ headerShown: false }} />
              <Stack.Screen name="emergency" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </EmergencyProvider>
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}