import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SignUpScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Регистрация</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { padding: 16, gap: 12 },
	title: { fontSize: 22, fontWeight: '700' }
});