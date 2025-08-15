import events from '@assets/cultural_db/events.json';
import { useQuery } from '@tanstack/react-query';

export type Event = typeof events[number];

export function getEvents(): Event[] {
	return events as Event[];
}

export function useEvents() {
	return useQuery({ queryKey: ['events'], queryFn: async () => getEvents() });
}