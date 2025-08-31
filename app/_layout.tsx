import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../contexts/AuthContext';
import { LocationProvider } from '../contexts/LocationContext';
import { EmergencyProvider } from '../contexts/EmergencyContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import { BoostsProvider } from '../contexts/BoostsContext';
import { OrdersProvider } from '../contexts/OrdersContext';
import { RoleProvider } from '../contexts/RoleContext';
import { TotemProvider } from '../contexts/TotemContext';
import { AIProvider } from '../contexts/AIContext';
import { PhotoFeedProvider } from '../contexts/PhotoFeedContext';

export default function RootLayout() {
  try {
    const apiKey = process.env.EXPO_PUBLIC_BUGSNAG_API_KEY as string | undefined;
    if (apiKey && typeof window !== 'undefined') {
      // Dynamic import to avoid SSR issues in static rendering
      import('@bugsnag/expo').then(m => {
        try { (m as any)?.default?.start({ apiKey }); } catch {}
      }).catch(() => {});
    }
  } catch {}
  return (
    <ThemeProvider>
      <AuthProvider>
        <LocationProvider>
          <EmergencyProvider>
            <FavoritesProvider>
            <BoostsProvider>
            <OrdersProvider>
            <RoleProvider>
            <TotemProvider>
            <AIProvider>
            <PhotoFeedProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="auth" options={{ headerShown: false }} />
              <Stack.Screen name="emergency" options={{ headerShown: false }} />
              <Stack.Screen name="boosts" options={{ headerShown: false }} />
              <Stack.Screen name="tours" options={{ headerShown: false }} />
              <Stack.Screen name="env" options={{ headerShown: false }} />
              <Stack.Screen name="operator" options={{ headerShown: false }} />
              <Stack.Screen name="guide" options={{ headerShown: false }} />
              <Stack.Screen name="transfer" options={{ headerShown: false }} />
              <Stack.Screen name="agent" options={{ headerShown: false }} />
              <Stack.Screen name="admin" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
            </PhotoFeedProvider>
            </AIProvider>
            </TotemProvider>
            </RoleProvider>
            </OrdersProvider>
            </BoostsProvider>
            </FavoritesProvider>
          </EmergencyProvider>
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}