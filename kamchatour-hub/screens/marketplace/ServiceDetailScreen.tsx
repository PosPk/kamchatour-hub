import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Screen from '@components/ui/Screen';

export default function ServiceDetailScreen() {
	return (
		<Screen>
			<Text style={styles.title}>Услуга — детали</Text>
		</Screen>
	);
}

const styles = StyleSheet.create({
	title: { fontSize: 22, fontWeight: '700' }
});