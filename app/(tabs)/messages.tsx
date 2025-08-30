import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { listThreads, Thread } from '../../lib/chat';
import { useRouter } from 'expo-router';
import { theme } from '../../lib/theme';

export default function MessagesScreen() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const router = useRouter();
  useEffect(() => { (async () => setThreads(await listThreads()))(); }, []);
  return (
    <View style={styles.container}>
      <FlatList
        data={threads}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => router.push(`/messages/${item.id}`)}>
            <View style={styles.rowCenter}>
              <View style={styles.avatar} />
              <View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.sub}>{item.participantName} • {item.lastMessage}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textSubtle} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, padding: 16 },
  item: { backgroundColor: theme.colors.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#cbd5e1', marginRight: 10 },
  title: { color: theme.colors.text, fontWeight: '700' },
  sub: { color: theme.colors.textSubtle, marginTop: 2, maxWidth: 220 },
});

