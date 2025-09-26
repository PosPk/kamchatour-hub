import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Linking, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getOperatorById, Operator, sendOperatorInquiry } from '../../lib/operators';

export default function OperatorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<Operator | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('Здравствуйте! Интересует тур/даты/стоимость.');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id) return;
      const data = await getOperatorById(String(id));
      setItem(data);
    })();
  }, [id]);

  const onSend = async () => {
    if (!item) return;
    if (!name || !email) {
      Alert.alert('Ошибка', 'Укажите имя и email');
      return;
    }
    setLoading(true);
    const ok = await sendOperatorInquiry({ operatorId: item.id, name, email, message });
    setLoading(false);
    if (ok.success) Alert.alert('Отправлено', 'Ваш запрос отправлен оператору');
  };

  if (!item) {
    return (
      <View style={styles.container}><Text>Загрузка...</Text></View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{item.name}</Text>
      {!!item.description && <Text style={styles.desc}>{item.description}</Text>}

      <View style={styles.block}>
        {item.website && (
          <Text style={styles.link} onPress={() => Linking.openURL(item.website!)}>
            {item.website}
          </Text>
        )}
        {!!item.phone && <Text style={styles.meta}>Телефон: {item.phone}</Text>}
        {!!item.activities?.length && <Text style={styles.meta}>Активности: {item.activities.join(', ')}</Text>}
        {!!item.regions?.length && <Text style={styles.meta}>Регионы: {item.regions.join(', ')}</Text>}
      </View>

      <View style={styles.form}>
        <Text style={styles.formTitle}>Заявка оператору</Text>
        <TextInput style={styles.input} placeholder="Ваше имя" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" autoCapitalize='none' keyboardType='email-address' value={email} onChangeText={setEmail} />
        <TextInput style={[styles.input, styles.textarea]} placeholder="Сообщение" value={message} onChangeText={setMessage} multiline numberOfLines={4} />
        <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} disabled={loading} onPress={onSend}>
          <Text style={styles.buttonText}>{loading ? 'Отправка…' : 'Отправить'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 22, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  desc: { color: '#475569', marginBottom: 12 },
  block: { backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16 },
  link: { color: '#2563eb', textDecorationLine: 'underline', marginBottom: 6 },
  meta: { color: '#334155', marginTop: 2 },
  form: { backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  formTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10 },
  textarea: { height: 100, textAlignVertical: 'top' },
  button: { backgroundColor: '#0891b2', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' }
});

