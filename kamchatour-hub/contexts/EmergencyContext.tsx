import React from 'react';
import { sendSos } from '@lib/emergency';
import { useLocationContext } from './LocationContext';

type EmergencyContextValue = {
	send: (note?: string) => Promise<void>;
};

const EmergencyContext = React.createContext<EmergencyContextValue | undefined>(undefined);

export function EmergencyProvider({ children }: any) {
	const { coordinates } = useLocationContext();

	async function send(note?: string) {
		if (!coordinates) return;
		const payload = note === undefined ? { coordinates } : { coordinates, note };
		await sendSos(payload);
	}

	const value = React.useMemo(() => ({ send }), [coordinates]);
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