import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../contexts/AuthContext';
import { LocationProvider } from '../contexts/LocationContext';
import { EmergencyProvider } from '../contexts/EmergencyContext';
// Optional providers (may not exist in cut-down repo)
const ThemeProvider = ({ children }: any) => children;
const FavoritesProvider = ({ children }: any) => children;
const BoostsProvider = ({ children }: any) => children;
const OrdersProvider = ({ children }: any) => children;
const RoleProvider = ({ children }: any) => children;
const TotemProvider = ({ children }: any) => children;
const AIProvider = ({ children }: any) => children;
const PhotoFeedProvider = ({ children }: any) => children;

export default function RootLayout() {
  // Bugsnag optional: guard missing dependency
  try {
    const apiKey = process.env.EXPO_PUBLIC_BUGSNAG_API_KEY as string | undefined;
    if (apiKey && typeof window !== 'undefined') {
      // Dynamic import; if package absent, ignore
      // eslint-disable-next-line import/no-unresolved
      import('@bugsnag/expo').then((m: any) => { try { m?.default?.start?.({ apiKey }); } catch {} }).catch(() => {});
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