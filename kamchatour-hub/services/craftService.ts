import masters from '@assets/cultural_db/masters.json';
import { useQuery } from '@tanstack/react-query';

export type Master = typeof masters[number];

export function getMasters(): Master[] {
	return masters as Master[];
}

export function useMasters() {
	return useQuery({ queryKey: ['masters'], queryFn: async () => getMasters() });
}