import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Screen from '@components/ui/Screen';

export default function CheckoutScreen() {
	return (
		<Screen>
			<Text style={styles.title}>Оформление заказа</Text>
		</Screen>
	);
}

const styles = StyleSheet.create({
	title: { fontSize: 22, fontWeight: '700' }
});