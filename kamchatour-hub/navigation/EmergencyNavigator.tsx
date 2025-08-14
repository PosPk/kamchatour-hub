import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';

const Stack = createNativeStackNavigator();

function SosScreen() {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Text>SOS</Text>
		</View>
	);
}

function SheltersScreen() {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Text>Укрытия</Text>
		</View>
	);
}

export default function EmergencyNavigator() {
	return (
		<Stack.Navigator>
			<Stack.Screen name="SOS" component={SosScreen} />
			<Stack.Screen name="Shelters" component={SheltersScreen} />
		</Stack.Navigator>
	);
}