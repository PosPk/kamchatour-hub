import React from 'react';
import { View } from 'react-native';
import { AuthProvider } from '@contexts/AuthContext';
import { LocationProvider } from '@contexts/LocationContext';
import { EmergencyProvider } from '@contexts/EmergencyContext';
import { ThemeProvider } from '@contexts/ThemeContext';
import { initializeI18n } from '@lib/i18n';
import HomeScreen from '@screens/main/HomeScreen';
import EcoSafetyScreen from '@screens/eco/EcoSafetyScreen';

export default function App() {
	React.useEffect(() => { initializeI18n(); }, []);
	const [route, setRoute] = React.useState<'home' | 'eco'>('home');
	return (
		<ThemeProvider>
			<AuthProvider>
				<LocationProvider>
					<EmergencyProvider>
						<View>
							{route === 'home' ? <HomeScreen /> : <EcoSafetyScreen />}
						</View>
					</EmergencyProvider>
				</LocationProvider>
			</AuthProvider>
		</ThemeProvider>
	);
}