import React from 'react';
import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Screen from '@components/ui/Screen';
import SOSButton from '@components/ui/SOSButton';
import { useLocation } from '@hooks/useLocation';
import { getCurrentWeather } from '@lib/weatherIntegration';
import { getMasters } from '@services/craftService';
import { useTranslation } from 'react-i18next';
import CraftMasterCard from '@components/culture/CraftMasterCard';

export default function HomeScreen() {
	const { t } = useTranslation();
	const { coordinates } = useLocation();
	const [weather, setWeather] = React.useState<{ temperatureC: number; condition: string } | null>(null);
	const masters = React.useMemo(() => getMasters().slice(0, 6), []);

	React.useEffect(() => {
		async function load() {
			if (!coordinates) return;
			const w = await getCurrentWeather(coordinates.latitude, coordinates.longitude);
			setWeather(w);
		}
		load();
	}, [coordinates]);

	const renderMaster = React.useCallback(({ item }: { item: (typeof masters)[number] }) => (
		<Animated.View entering={FadeInUp.duration(300)} style={styles.cardWrap}>
			<CraftMasterCard name={item.name} craft={item.craft} village={item.village} />
		</Animated.View>
	), [masters]);

	return (
		<Screen>
			<Text style={styles.title}>{t('common.appName', 'КамчатТур Хаб')}</Text>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>{t('sos.title', 'Аварийная помощь')}</Text>
				<SOSButton />
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>{t('weather.title', 'Погода')}</Text>
				{weather ? (
					<Text style={styles.text}>
						{weather.temperatureC}°C • {weather.condition}
					</Text>
				) : (
					<Text style={styles.text}>{t('common.loading', 'Загрузка...')}</Text>
				)}
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>{t('craft.title', 'Мастера промыслов')}</Text>
				<FlatList
					data={masters}
					keyExtractor={(it) => it.id}
					renderItem={renderMaster as any}
					initialNumToRender={4}
					removeClippedSubviews
					windowSize={5}
				/>
				<Pressable>
					<Text style={styles.link}>{t('craft.all', 'Все мастера →')}</Text>
				</Pressable>
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	title: { fontSize: 24, fontWeight: '700' },
	section: { paddingVertical: 8, gap: 8 },
	sectionTitle: { fontSize: 18, fontWeight: '600' },
	text: { fontSize: 16 },
	link: { color: '#1e90ff', fontSize: 16 },
	cardWrap: { paddingVertical: 6 }
});