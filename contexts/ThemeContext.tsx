import React, { createContext, useContext, useMemo, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  colorScheme: Exclude<ColorSchemeName, 'no-preference'>;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('system');

  const system = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
  const colorScheme = (theme === 'system' ? system : theme) as 'light' | 'dark';

  const value = useMemo<ThemeContextType>(() => ({ theme, colorScheme, setTheme }), [theme, colorScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

