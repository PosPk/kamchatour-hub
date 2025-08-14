import React from 'react';
import { View } from 'react-native';
import { AuthProvider } from '@contexts/AuthContext';
import { LocationProvider } from '@contexts/LocationContext';
import { EmergencyProvider } from '@contexts/EmergencyContext';
import HomeScreen from '@screens/main/HomeScreen';
import EcoSafetyScreen from '@screens/eco/EcoSafetyScreen';

export default function App() {
	const [route, setRoute] = React.useState<'home' | 'eco'>('home');
	return (
		<AuthProvider>
			<LocationProvider>
				<EmergencyProvider>
					<View>
						{route === 'home' ? <HomeScreen /> : <EcoSafetyScreen />}
					</View>
				</EmergencyProvider>
			</LocationProvider>
		</AuthProvider>
	);
}