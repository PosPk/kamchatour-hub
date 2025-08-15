import React from 'react';
import { Text, StyleSheet, FlatList } from 'react-native';
import Screen from '@components/ui/Screen';
import { useTranslation } from 'react-i18next';

const MOCK = Array.from({ length: 6 }).map((_, i) => ({ id: `b${i + 1}`, title: `Booking #${i + 1}` }));

export default function BookingScreen() {
	const { t } = useTranslation();
	const renderItem = React.useCallback(({ item }: { item: { id: string; title: string } }) => (
		<Text style={styles.item}>{item.title}</Text>
	), []);
	return (
		<Screen>
			<Text style={styles.title}>{t('booking.title', 'Бронирования')}</Text>
			<FlatList data={MOCK} keyExtractor={(it: { id: string }) => it.id} renderItem={renderItem} />
		</Screen>
	);
}

const styles = StyleSheet.create({
	title: { fontSize: 22, fontWeight: '700' },
	item: { paddingVertical: 8, fontSize: 16 }
});