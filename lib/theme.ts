export const theme = {
  colors: {
    primary: '#0891b2',
    primaryDark: '#0c4a6e',
    accent: '#10b981',
    danger: '#dc2626',
    warning: '#f59e0b',
    success: '#059669',
    surface: '#ffffff',
    border: '#e2e8f0',
    text: '#0f172a',
    textSubtle: '#475569',
    bg: '#f8fafc',
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    pill: 9999,
  },
  spacing: (n: number) => n * 4,
  shadow: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
  },
  typography: {
    title: { fontSize: 18, fontWeight: '700' as const },
    body: { fontSize: 14 },
    small: { fontSize: 12, color: '#64748b' },
  },
};

