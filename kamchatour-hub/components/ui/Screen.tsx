import React from 'react';
import { View, StyleSheet } from 'react-native';

type Props = { children: React.ReactNode };

export default function Screen({ children }: Props) {
	return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
	container: { padding: 16, gap: 12 }
});