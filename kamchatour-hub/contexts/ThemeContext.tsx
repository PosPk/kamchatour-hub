import React from 'react';

export type Theme = {
	colors: {
		background: string;
		text: string;
		primary: string;
		muted: string;
	};
};

const lightTheme: Theme = {
	colors: { background: '#ffffff', text: '#111111', primary: '#1e90ff', muted: '#888' }
};

const darkTheme: Theme = {
	colors: { background: '#0b0b0b', text: '#f0f0f0', primary: '#1e90ff', muted: '#aaa' }
};

type ThemeContextValue = { theme: Theme; isDark: boolean; toggle: () => void };

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [isDark, setIsDark] = React.useState(false);
	const theme = isDark ? darkTheme : lightTheme;
	const toggle = React.useCallback(() => setIsDark(v => !v), []);
	const value = React.useMemo(() => ({ theme, isDark, toggle }), [theme, isDark, toggle]);
	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
	const ctx = React.useContext(ThemeContext);
	if (!ctx) throw new Error('ThemeContext not found');
	return ctx;
}