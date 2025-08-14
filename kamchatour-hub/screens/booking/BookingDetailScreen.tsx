import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Screen from '@components/ui/Screen';

export default function BookingDetailScreen() {
	return (
		<Screen>
			<Text style={styles.title}>Детали бронирования</Text>
		</Screen>
	);
}

const styles = StyleSheet.create({
	title: { fontSize: 22, fontWeight: '700' }
});