import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@screens/main/HomeScreen';
import EcoSafetyScreen from '@screens/eco/EcoSafetyScreen';
import MarketplaceScreen from '@screens/marketplace/MarketplaceScreen';
import BookingScreen from '@screens/booking/BookingScreen';
import { Text } from 'react-native';

export type RootTabParamList = {
	home: undefined;
	eco: undefined;
	marketplace: undefined;
	booking: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function RootNavigator() {
	return (
		<Tab.Navigator
			initialRouteName="home"
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarIcon: ({ color }) => {
					const icon = route.name === 'home' ? '🏠' : route.name === 'eco' ? '🌿' : route.name === 'marketplace' ? '🛒' : '📅';
					return <Text style={{ color }}>{icon}</Text>;
				}
			})}
		>
			<Tab.Screen name="home" component={HomeScreen} options={{ title: 'Home' }} />
			<Tab.Screen name="eco" component={EcoSafetyScreen} options={{ title: 'Eco' }} />
			<Tab.Screen name="marketplace" component={MarketplaceScreen} options={{ title: 'Market' }} />
			<Tab.Screen name="booking" component={BookingScreen} options={{ title: 'Booking' }} />
		</Tab.Navigator>
	);
}