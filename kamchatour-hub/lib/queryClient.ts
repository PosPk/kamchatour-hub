import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const client = new QueryClient({
	defaultOptions: {
		queries: { staleTime: 5 * 60 * 1000, gcTime: 30 * 60 * 1000, retry: 1 }
	}
});

export function AppQueryProvider({ children }: { children: React.ReactNode }) {
	return React.createElement(QueryClientProvider, { client }, children);
}