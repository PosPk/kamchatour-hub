import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../contexts/AuthContext';
import * as Sentry from 'sentry-expo';

// Initialize Sentry once at app startup
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enableInExpoDevelopment: true,
  debug: false,
  tracesSampleRate: 1.0,
});

// Capture unhandled promise rejections
if (typeof globalThis !== 'undefined' && typeof globalThis.addEventListener === 'function') {
  globalThis.addEventListener('unhandledrejection', (event: PromiseRejectionEvent | any) => {
    try {
      const reason = (event && (event.reason || event.detail)) ?? event;
      // @ts-ignore
      Sentry.Native.captureException(reason instanceof Error ? reason : new Error(String(reason)));
    } catch {}
  });
}
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