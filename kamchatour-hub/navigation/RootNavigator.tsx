import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@screens/main/HomeScreen';
import EcoSafetyScreen from '@screens/eco/EcoSafetyScreen';

export type RootStackParamList = {
	home: undefined;
	eco: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
	return (
		<Stack.Navigator initialRouteName="home" screenOptions={{ headerShown: false }}>
			<Stack.Screen name="home" component={HomeScreen} />
			<Stack.Screen name="eco" component={EcoSafetyScreen} />
		</Stack.Navigator>
	);
}