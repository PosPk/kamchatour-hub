import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getThread, sendMessage, Message, subscribeToThread } from '../../lib/chat';
import { theme } from '../../lib/theme';

export default function ChatView() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    (async () => {
      if (!id) return;
      const res = await getThread(String(id));
      setTitle(res.thread?.title ?? 'Чат');
      setMessages(res.messages);
    })();
    let unsub = () => {};
    if (id) {
      unsub = subscribeToThread(String(id), (msg) => setMessages(prev => [...prev, msg]));
    }
    return () => { unsub(); };
  }, [id]);

  const onSend = async () => {
    if (!id || !text.trim()) return;
    const msg = await sendMessage(String(id), text.trim());
    setMessages(prev => [...prev, msg]);
    setText('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.select({ ios: 'padding', android: undefined })}>
      <View style={styles.header}><Text style={styles.headerTitle}>{title}</Text></View>
      <FlatList ref={listRef} contentContainerStyle={styles.list} data={messages} keyExtractor={i => i.id} renderItem={({ item }) => (
        <View style={[styles.bubble, item.author==='me'?styles.me:styles.them]}>
          <Text style={styles.msg}>{item.text}</Text>
          <Text style={styles.time}>{new Date(item.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
      )} />
      <View style={styles.composer}>
        <TextInput style={styles.input} placeholder="Сообщение" value={text} onChangeText={setText} />
        <TouchableOpacity style={styles.send} onPress={onSend}><Text style={styles.sendText}>Отпр.</Text></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.bg },
  header: { backgroundColor: theme.colors.primary, padding: 14 },
  headerTitle: { color: '#fff', fontWeight: '700' },
  list: { padding: 12 },
  bubble: { maxWidth: '80%', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 8 },
  me: { alignSelf: 'flex-end', backgroundColor: '#e0f2fe' },
  them: { alignSelf: 'flex-start', backgroundColor: '#e5e7eb' },
  msg: { color: theme.colors.text },
  time: { color: theme.colors.textSubtle, fontSize: 11, marginTop: 4, alignSelf: 'flex-end' },
  composer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
  input: { flex: 1, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8, backgroundColor: '#fff' },
  send: { backgroundColor: theme.colors.primary, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  sendText: { color: '#fff', fontWeight: '700' },
});

