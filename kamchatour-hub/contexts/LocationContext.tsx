import React from 'react';
import { getCurrentLocation, Coordinates } from '@lib/location';

type LocationContextValue = {
	coordinates: Coordinates | null;
	refresh: () => Promise<void>;
};

const LocationContext = React.createContext<LocationContextValue | undefined>(undefined);

export function LocationProvider({ children }: any) {
	const [coordinates, setCoordinates] = React.useState<Coordinates | null>(null);

	async function refresh() {
		const loc = await getCurrentLocation();
		setCoordinates(loc);
	}

	React.useEffect(() => {
		refresh();
	}, []);

	const value = React.useMemo(() => ({ coordinates, refresh }), [coordinates]);
	return (
		<LocationContext.Provider value={value}>
			{children}
		</LocationContext.Provider>
	);
}

export function useLocationContext() {
	const ctx = React.useContext(LocationContext);
	if (!ctx) throw new Error('LocationContext not found');
	return ctx;
}