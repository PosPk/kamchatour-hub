import React from 'react';
import { View } from 'react-native';
import { AuthProvider } from '@contexts/AuthContext';
import { LocationProvider } from '@contexts/LocationContext';
import { EmergencyProvider } from '@contexts/EmergencyContext';
import HomeScreen from '@screens/main/HomeScreen';

export default function App() {
	return (
		<AuthProvider>
			<LocationProvider>
				<EmergencyProvider>
					<View>
						<HomeScreen />
					</View>
				</EmergencyProvider>
			</LocationProvider>
		</AuthProvider>
	);
}