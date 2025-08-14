import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import EcoTipCard from '@components/eco/EcoTipCard';

const TIPS: { id: string; title: string; description?: string }[] = [
	{ id: 't1', title: 'Сохраняйте дистанцию от дикой природы', description: 'Не кормите животных и не приближайтесь для фото.' },
	{ id: 't2', title: 'Не оставляйте следов', description: 'Забирайте мусор с собой, пользуйтесь маркированными тропами.' },
	{ id: 't3', title: 'Уважайте культурные места', description: 'Не берите артефакты, не нарушайте покой священных мест.' },
	{ id: 't4', title: 'Ответственное купание в термальных источниках', description: 'Следуйте правилам, не используйте химические средства в воде.' },
];

export default function EcoSafetyScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Экологическая безопасность</Text>
			{TIPS.map(t => (
				<View key={t.id} style={styles.tipWrap}>
					<EcoTipCard title={t.title} description={t.description} />
				</View>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { padding: 16, gap: 12 },
	title: { fontSize: 22, fontWeight: '700' },
	tipWrap: { paddingVertical: 6 }
});