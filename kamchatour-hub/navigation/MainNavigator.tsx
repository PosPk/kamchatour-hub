import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/main/HomeScreen';
import ItineraryScreen from '../screens/itinerary/ItineraryScreen';
import MarketplaceScreen from '../screens/marketplace/MarketplaceScreen';
import EventCalendarScreen from '../screens/culture/EventCalendarScreen';

const Tabs = createBottomTabNavigator();

export default function MainNavigator() {
	return (
		<Tabs.Navigator screenOptions={{ headerShown: false }}>
			<Tabs.Screen name="Home" component={HomeScreen} />
			<Tabs.Screen name="Culture" component={EventCalendarScreen} />
			<Tabs.Screen name="Itinerary" component={ItineraryScreen} />
			<Tabs.Screen name="Marketplace" component={MarketplaceScreen} />
		</Tabs.Navigator>
	);
}