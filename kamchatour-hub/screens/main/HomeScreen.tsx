import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import SOSButton from '@components/ui/SOSButton';
import { useLocation } from '@hooks/useLocation';
import { getCurrentWeather } from '@lib/weatherIntegration';
import { getMasters } from '@services/craftService';
import { getEvents } from '@services/eventService';
import CraftMasterCard from '@components/culture/CraftMasterCard';
import EventCard from '@components/culture/EventCard';

export default function HomeScreen() {
	const { coordinates } = useLocation();
	const [weather, setWeather] = React.useState<{ temperatureC: number; condition: string } | null>(null);
	const masters = React.useMemo(() => getMasters().slice(0, 2), []);
	const events = React.useMemo(() => getEvents().slice(0, 2), []);

	React.useEffect(() => {
		async function load() {
			if (!coordinates) return;
			const w = await getCurrentWeather(coordinates.latitude, coordinates.longitude);
			setWeather(w);
		}
		load();
	}, [coordinates]);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>КамчатТур Хаб</Text>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Безопасность</Text>
				<SOSButton />
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Погода</Text>
				{weather ? (
					<Text style={styles.text}>
						{weather.temperatureC}°C • {weather.condition}
					</Text>
				) : (
					<Text style={styles.text}>Загрузка...</Text>
				)}
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Мастера промыслов</Text>
				{masters.map(m => (
					<View key={m.id} style={styles.cardWrap}>
						<CraftMasterCard name={m.name} craft={m.craft} village={m.village} />
					</View>
				))}
				<Pressable>
					<Text style={styles.link}>Все мастера →</Text>
				</Pressable>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Этнособытия</Text>
				{events.map(e => (
					<View key={e.id} style={styles.cardWrap}>
						<EventCard title={e.title} location={e.location} month={e.month} />
					</View>
				))}
				<Pressable>
					<Text style={styles.link}>Календарь событий →</Text>
				</Pressable>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Эко‑безопасность</Text>
				<Pressable>
					<Text style={styles.link}>Открыть рекомендации →</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { padding: 16, gap: 16 },
	title: { fontSize: 24, fontWeight: '700' },
	section: { paddingVertical: 8, gap: 8 },
	sectionTitle: { fontSize: 18, fontWeight: '600' },
	text: { fontSize: 16 },
	link: { color: '#1e90ff', fontSize: 16 },
	cardWrap: { paddingVertical: 6 }
});