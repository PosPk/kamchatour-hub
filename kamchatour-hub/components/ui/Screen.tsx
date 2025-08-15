import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';

type Props = { children: React.ReactNode };

export default function Screen({ children }: Props) {
	const { theme } = useTheme();
	return <View style={[styles.container, { backgroundColor: theme.colors.background }]}>{children}</View>;
}

const styles = StyleSheet.create({
	container: { padding: 16, gap: 12, flex: 1 }
});