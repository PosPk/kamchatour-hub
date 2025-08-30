import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { track } from '../../lib/analytics';
import { useTotems } from '../../contexts/TotemContext';

interface FeedItem { id: string; uri: string; title?: string; likes: number; }

export default function FeedScreen() {
	const [items, setItems] = useState<FeedItem[]>([]);
	const [title, setTitle] = useState('');
	const [uri, setUri] = useState('');
	const { award } = useTotems();

	const addPost = async () => {
		if (!uri) return;
		const post: FeedItem = { id: Date.now().toString(), uri, title, likes: 0 };
		setItems([post, ...items]);
		setTitle(''); setUri('');
		track('feed_view', { action: 'post_added' });
		await award('volcano', 15, 'post_in_feed');
	};

	const like = (id: string) => {
		setItems(prev => prev.map(it => it.id === id ? { ...it, likes: it.likes + 1 } : it));
	};

	return (
		<View style={styles.container}>
			<View style={styles.composer}>
				<TextInput placeholder="Заголовок" value={title} onChangeText={setTitle} style={styles.input} />
				<TextInput placeholder="Image URL" value={uri} onChangeText={setUri} style={styles.input} />
				<TouchableOpacity style={styles.button} onPress={addPost}><Text style={styles.buttonText}>Опубликовать</Text></TouchableOpacity>
			</View>
			<FlatList
				data={items}
				keyExtractor={it => it.id}
				renderItem={({ item }) => (
					<View style={styles.card}>
						{item.uri ? <Image source={{ uri: item.uri }} style={styles.image} /> : <View style={[styles.image, styles.imagePlaceholder]} />}
						<Text style={styles.title}>{item.title || 'Без названия'}</Text>
						<View style={styles.row}>
							<TouchableOpacity style={styles.like} onPress={() => like(item.id)}>
								<Ionicons name="heart" size={16} color="#ef4444" /><Text style={styles.likeText}>{item.likes}</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#f8fafc' },
	composer: { padding: 16, backgroundColor: '#fff', gap: 8 },
	input: { backgroundColor:'#f1f5f9', borderRadius:8, paddingHorizontal:12, height:40 },
	button: { backgroundColor:'#0891b2', borderRadius:8, height:40, alignItems:'center', justifyContent:'center' },
	buttonText: { color:'#fff', fontWeight:'700' },
	card: { backgroundColor:'#fff', margin:12, borderRadius:12, overflow:'hidden' },
	image: { width:'100%', height:200, backgroundColor:'#e2e8f0' },
	imagePlaceholder: { alignItems:'center', justifyContent:'center' },
	title: { padding:12, fontWeight:'700', color:'#0f172a' },
	row: { flexDirection:'row', alignItems:'center', padding:12 },
	like: { flexDirection:'row', alignItems:'center', gap:6 },
	likeText: { color:'#ef4444', marginLeft:6 },
});

