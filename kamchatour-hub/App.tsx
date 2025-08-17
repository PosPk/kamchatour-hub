import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from 'react-query';

// Импорты экранов
import HomeScreen from './screens/HomeScreen';
import QuantumRouteScreen from './screens/QuantumRouteScreen';
import DestinationsScreen from './screens/DestinationsScreen';
import InsuranceScreen from './screens/InsuranceScreen';
import BoostsScreen from './screens/BoostsScreen';
import PhotoReportsScreen from './screens/PhotoReportsScreen';
import ProfileScreen from './screens/ProfileScreen';
import ARVRScreen from './screens/ARVRScreen';
import QuantumBlockchainScreen from './screens/QuantumBlockchainScreen';

// Импорты контекстов
import { AuthProvider } from './contexts/AuthContext';
import { LocationProvider } from './contexts/LocationContext';
import { QuantumProvider } from './contexts/QuantumContext';

const Stack = createStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <SafeAreaProvider>
          <AuthProvider>
            <LocationProvider>
              <QuantumProvider>
                <NavigationContainer>
                  <StatusBar style="auto" />
                  <Stack.Navigator 
                    initialRouteName="Home"
                    screenOptions={{
                      headerStyle: {
                        backgroundColor: '#4A90E2',
                      },
                      headerTintColor: '#fff',
                      headerTitleStyle: {
                        fontWeight: 'bold',
                      },
                    }}
                  >
                    <Stack.Screen 
                      name="Home" 
                      component={HomeScreen} 
                      options={{ title: 'Kamchatour Hub' }}
                    />
                    <Stack.Screen 
                      name="QuantumRoute" 
                      component={QuantumRouteScreen} 
                      options={{ title: 'Квантовый маршрут' }}
                    />
                    <Stack.Screen 
                      name="Destinations" 
                      component={DestinationsScreen} 
                      options={{ title: 'Направления' }}
                    />
                    <Stack.Screen 
                      name="Insurance" 
                      component={InsuranceScreen} 
                      options={{ title: 'Страхование' }}
                    />
                    <Stack.Screen 
                      name="Boosts" 
                      component={BoostsScreen} 
                      options={{ title: 'Премиум услуги' }}
                    />
                    <Stack.Screen 
                      name="PhotoReports" 
                      component={PhotoReportsScreen} 
                      options={{ title: 'Фотоотчеты' }}
                    />
                    <Stack.Screen 
                      name="Profile" 
                      component={ProfileScreen} 
                      options={{ title: 'Профиль' }}
                    />
                    <Stack.Screen 
                      name="ARVR" 
                      component={ARVRScreen} 
                      options={{ title: 'AR/VR тур' }}
                    />
                    <Stack.Screen 
                      name="QuantumBlockchain" 
                      component={QuantumBlockchainScreen} 
                      options={{ title: 'Квантово-блокчейн' }}
                    />
                  </Stack.Navigator>
                </NavigationContainer>
              </QuantumProvider>
            </LocationProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}