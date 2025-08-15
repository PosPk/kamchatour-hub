import React from 'react';
import { sendSos } from '@lib/emergency';
import { useLocationContext } from './LocationContext';

type EmergencyContextValue = {
	send: (note?: string) => Promise<void>;
};

const EmergencyContext = React.createContext<EmergencyContextValue | undefined>(undefined);

export function EmergencyProvider({ children }: { children: React.ReactNode }) {
	const { coordinates } = useLocationContext();

	const send = React.useCallback(async (note?: string) => {
		if (!coordinates) return;
		const payload = note === undefined ? { coordinates } : { coordinates, note };
		await sendSos(payload);
	}, [coordinates]);

	const value = React.useMemo(() => ({ send }), [send]);
	return (
		<EmergencyContext.Provider value={value}>
			{children}
		</EmergencyContext.Provider>
	);
}

export function useEmergencyContext() {
	const ctx = React.useContext(EmergencyContext);
	if (!ctx) throw new Error('EmergencyContext not found');
	return ctx;
}