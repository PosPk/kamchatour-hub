import React from 'react';
import { Text, StyleSheet, FlatList } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Screen from '@components/ui/Screen';
import { useTranslation } from 'react-i18next';

const MOCK = Array.from({ length: 10 }).map((_, i) => ({ id: `s${i + 1}`, title: `Service ${i + 1}` }));

export default function MarketplaceScreen() {
	const { t } = useTranslation();
	const renderItem = React.useCallback(({ item }: { item: { id: string; title: string } }) => (
		<Animated.Text entering={FadeInUp.duration(250)} style={styles.item}>{item.title}</Animated.Text>
	), []);
	return (
		<Screen>
			<Text style={styles.title}>{t('market.title', 'Маркетплейс услуг')}</Text>
			<FlatList data={MOCK} keyExtractor={(it: { id: string }) => it.id} renderItem={renderItem} />
		</Screen>
	);
}

const styles = StyleSheet.create({
	title: { fontSize: 22, fontWeight: '700' },
	item: { paddingVertical: 8, fontSize: 16 }
});