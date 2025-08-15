import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SheltersScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Убежища</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { padding: 16, gap: 12 },
	title: { fontSize: 22, fontWeight: '700' }
});