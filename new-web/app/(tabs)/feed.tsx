import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FeedPost, listFeed, toggleLike, addPost } from '../../lib/feed';

export default function FeedScreen() {
  const [items, setItems] = useState<FeedPost[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');

  useEffect(() => {
    (async () => {
      setItems(await listFeed());
    })();
  }, []);

  const onLike = async (id: string) => {
    const updated = await toggleLike(id);
    if (updated) setItems(prev => prev.map(p => p.id === id ? updated : p));
  };

  const onAdd = async () => {
    if (!imageUrl) return;
    const post = await addPost({ userId: 'me', userName: 'Я', imageUrl, caption });
    setItems(prev => [post, ...prev]);
    setImageUrl('');
    setCaption('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.newPost}>
        <TextInput style={styles.input} placeholder="Ссылка на фото" value={imageUrl} onChangeText={setImageUrl} />
        <TextInput style={styles.input} placeholder="Подпись" value={caption} onChangeText={setCaption} />
        <TouchableOpacity style={styles.postBtn} onPress={onAdd}><Text style={styles.postBtnText}>Опубликовать</Text></TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.rowCenter}>
                <View style={styles.avatar} />
                <Text style={styles.user}>{item.userName}</Text>
              </View>
              <Text style={styles.time}>{new Date(item.createdAt).toLocaleString('ru-RU')}</Text>
            </View>
            <Image source={{ uri: item.imageUrl }} style={styles.photo} />
            {!!item.caption && <Text style={styles.caption}>{item.caption}</Text>}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.rowCenter} onPress={() => onLike(item.id)}>
                <Ionicons name={item.likedByMe ? 'heart' : 'heart-outline'} size={20} color={item.likedByMe ? '#ef4444' : '#334155'} />
                <Text style={styles.count}>{item.likes}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  newPost: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', padding: 12, marginBottom: 12 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 8 },
  postBtn: { alignItems: 'center', backgroundColor: '#0891b2', borderRadius: 10, paddingVertical: 10 },
  postBtnText: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 12 },
  cardHeader: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#cbd5e1', marginRight: 8 },
  user: { color: '#0f172a', fontWeight: '700' },
  time: { color: '#64748b', fontSize: 12 },
  photo: { width: '100%', height: 220, backgroundColor: '#e2e8f0' },
  caption: { paddingHorizontal: 12, paddingVertical: 10, color: '#334155' },
  actions: { paddingHorizontal: 12, paddingBottom: 12 },
  count: { marginLeft: 4, color: '#334155' },
});

