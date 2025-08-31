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

export default function RootLayout() {
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