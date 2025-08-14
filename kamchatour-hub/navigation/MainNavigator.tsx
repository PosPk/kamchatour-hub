import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/main/HomeScreen';
import ItineraryScreen from '../screens/itinerary/ItineraryScreen';
import MarketplaceScreen from '../screens/marketplace/MarketplaceScreen';
import EventCalendarScreen from '../screens/culture/EventCalendarScreen';
import ActivitiesScreen from '../screens/activities/ActivitiesScreen';
import EcoScreen from '../screens/eco/EcoScreen';
import SheltersScreen from '../screens/shelters/SheltersScreen';
import ChecklistsScreen from '../screens/checklists/ChecklistsScreen';
import AgentScreen from '../screens/agent/AgentScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';

const Tabs = createBottomTabNavigator();

export default function MainNavigator() {
	return (
		<Tabs.Navigator screenOptions={{ headerShown: false }}>
			<Tabs.Screen name="Home" component={HomeScreen} />
			<Tabs.Screen name="Activities" component={ActivitiesScreen} />
			<Tabs.Screen name="Eco" component={EcoScreen} />
			<Tabs.Screen name="Shelters" component={SheltersScreen} />
			<Tabs.Screen name="Checklists" component={ChecklistsScreen} />
			<Tabs.Screen name="Agent" component={AgentScreen} />
			<Tabs.Screen name="Onboarding" component={OnboardingScreen} />
			<Tabs.Screen name="Culture" component={EventCalendarScreen} />
			<Tabs.Screen name="Itinerary" component={ItineraryScreen} />
			<Tabs.Screen name="Marketplace" component={MarketplaceScreen} />
		</Tabs.Navigator>
	);
}