import 'react-native-gesture-handler';
import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '@contexts/AuthContext';
import { LocationProvider } from '@contexts/LocationContext';
import { EmergencyProvider } from '@contexts/EmergencyContext';
import { ThemeProvider } from '@contexts/ThemeContext';
import { initializeI18n } from '@lib/i18n';
import RootNavigator from '@navigation/RootNavigator';

export default function App() {
	React.useEffect(() => { initializeI18n(); }, []);

	return (
		<ThemeProvider>
			<AuthProvider>
				<LocationProvider>
					<EmergencyProvider>
						<NavigationContainer>
							<RootNavigator />
						</NavigationContainer>
					</EmergencyProvider>
				</LocationProvider>
			</AuthProvider>
		</ThemeProvider>
	);
}