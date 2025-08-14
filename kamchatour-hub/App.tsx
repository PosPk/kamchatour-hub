import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainNavigator from './navigation/MainNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import EmergencyNavigator from './navigation/EmergencyNavigator';

const RootStack = createNativeStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<RootStack.Navigator screenOptions={{ headerShown: false }}>
				<RootStack.Screen name="Auth" component={AuthNavigator} />
				<RootStack.Screen name="Main" component={MainNavigator} />
				<RootStack.Screen name="Emergency" component={EmergencyNavigator} />
			</RootStack.Navigator>
		</NavigationContainer>
	);
}