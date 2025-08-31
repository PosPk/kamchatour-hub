import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAI } from '../../contexts/AIContext';

export default function AIScreen() {
	const { messages, send, loading } = useAI();
	const [value, setValue] = useState('');
	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>AI помощник</Text>
			<ScrollView style={styles.chat} contentContainerStyle={{ padding: 12 }}>
				{messages.map((m, idx) => (
					<View key={idx} style={[styles.bubble, m.role === 'user' ? styles.user : styles.assistant]}>
						<Text style={styles.text}>{m.content}</Text>
					</View>
				))}
				{loading && <Text style={styles.hint}>AI печатает…</Text>}
			</ScrollView>
			<View style={styles.composer}>
				<TextInput value={value} onChangeText={setValue} placeholder="Задайте вопрос" style={styles.input} />
				<TouchableOpacity style={styles.button} onPress={async () => { if (!value.trim()) return; await send(value.trim()); setValue(''); }}>
					<Text style={styles.buttonText}>Отправить</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#f8fafc' },
	title: { fontSize: 20, fontWeight: '700', padding: 16, color: '#0f172a' },
	chat: { flex: 1 },
	composer: { flexDirection: 'row', gap: 8, padding: 12, backgroundColor: '#fff' },
	input: { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 8, paddingHorizontal: 12, height: 40 },
	button: { backgroundColor: '#0891b2', borderRadius: 8, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
	buttonText: { color: '#fff', fontWeight: '700' },
	bubble: { marginBottom: 8, padding: 10, borderRadius: 10, maxWidth: '80%' },
	user: { alignSelf: 'flex-end', backgroundColor: '#e0f2fe' },
	assistant: { alignSelf: 'flex-start', backgroundColor: '#fff' },
	text: { color: '#0f172a' },
	hint: { color: '#64748b', padding: 12 },
});

