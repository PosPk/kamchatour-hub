import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { track } from '../../lib/analytics';

const sampleTours = [
  { id: '1', title: 'Вулкан Мутновский', difficulty: 'medium', price: 8000, days: 1 },
  { id: '2', title: 'Долина гейзеров', difficulty: 'easy', price: 15000, days: 2 },
  { id: '3', title: 'Медвежье сафари', difficulty: 'easy', price: 12000, days: 1 },
];

export default function ToursCatalog() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [sort, setSort] = useState<'price_asc' | 'price_desc' | 'days_asc' | 'days_desc'>('price_asc');
  const [listening, setListening] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  const filtered = useMemo(() => {
    track('search', { q: query });
    let list = sampleTours.filter(t =>
      t.title.toLowerCase().includes(query.toLowerCase()) && (difficulty === 'all' || t.difficulty === difficulty)
    );
    switch (sort) {
      case 'price_asc': list = list.sort((a, b) => a.price - b.price); break;
      case 'price_desc': list = list.sort((a, b) => b.price - a.price); break;
      case 'days_asc': list = list.sort((a, b) => a.days - b.days); break;
      case 'days_desc': list = list.sort((a, b) => b.days - a.days); break;
    }
    return list;
  }, [query, difficulty, sort]);

  const startVoice = async () => {
    try {
      // Web Speech API only on web
      const isWeb = typeof window !== 'undefined' && typeof (window as any).webkitSpeechRecognition !== 'undefined' || typeof (window as any).SpeechRecognition !== 'undefined';
      if (!isWeb) {
        Alert.alert('Голосовой ввод', Platform.OS === 'web' ? 'Браузер не поддерживает SpeechRecognition' : 'Доступно в веб-версии');
        return;
      }
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SR();
      rec.lang = 'ru-RU';
      rec.interimResults = false;
      setListening(true);
      rec.onresult = (e: any) => {
        const text = e.results?.[0]?.[0]?.transcript || '';
        setQuery(text);
        setListening(false);
        track('search', { via: 'voice', q: text });
      };
      rec.onerror = () => { setListening(false); Alert.alert('Голосовой ввод', 'Не удалось распознать речь'); };
      rec.onend = () => setListening(false);
      rec.start();
    } catch {
      setListening(false);
    }
  };

  const applyAIAdvice = (answer: string) => {
    const text = answer.toLowerCase();
    // Heuristics for difficulty
    if (text.includes('лёгк') || text.includes('легк') || text.includes('easy')) setDifficulty('easy');
    else if (text.includes('средн') || text.includes('medium')) setDifficulty('medium');
    else if (text.includes('сложн') || text.includes('hard')) setDifficulty('hard');

    // Heuristics for price sort
    if (text.includes('дешев') || text.includes('недорог')) setSort('price_asc');
    if (text.includes('дорог') || text.includes('премиум')) setSort('price_desc');

    // Query keywords: try extract a quoted phrase or last sentence
    const m = answer.match(/[«"“](.*?)[»"”]/);
    if (m && m[1]) setQuery(m[1]);
  };

  const onAskAI = async () => {
    try {
      setLoadingAI(true);
      const userPref = `Подбери тур на Камчатке по предпочтениям.
Текущий запрос: "${query || 'пусто'}".
Сложность: ${difficulty}. Сортировка: ${sort}.
Верни краткую рекомендацию на русском и, при возможности, пометь желаемую сложность (легко/средне/сложно) и ценовой диапазон словами.`;
      const r = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [
          { role: 'system', content: 'Ты помогаешь подобрать тур на Камчатке. Отвечай кратко.' },
          { role: 'user', content: userPref },
        ]})
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'AI error');
      const content = j?.content || '';
      applyAIAdvice(content);
      Alert.alert('AI‑подбор', content.slice(0, 400));
      track('search', { via: 'ai', q: query, difficulty, sort });
    } catch (e: any) {
      Alert.alert('AI‑подбор', e?.message || 'Ошибка запроса');
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Туры Камчатки</Text>
        </View>
        <View style={styles.filters}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#64748b" />
            <TextInput placeholder="Поиск туров" style={styles.input} value={query} onChangeText={setQuery} />
            <TouchableOpacity onPress={startVoice} accessibilityLabel="Голосовой поиск" style={styles.iconBtn}>
              <Ionicons name={listening ? 'mic' : 'mic-outline'} size={20} color={listening ? '#dc2626' : '#64748b'} />
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 12, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <TouchableOpacity onPress={onAskAI} style={[styles.aiBtn, loadingAI && { opacity: 0.7 }]} disabled={loadingAI}>
              <Ionicons name="sparkles-outline" size={18} color="#fff" />
              <Text style={styles.aiBtnText}>{loadingAI ? 'Подбираю…' : 'Подобрать с AI'}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
            {['all','easy','medium','hard'].map(d => (
              <TouchableOpacity key={d} style={[styles.chip, difficulty===d && styles.chipActive]} onPress={()=>setDifficulty(d as any)}>
                <Text style={[styles.chipText, difficulty===d && styles.chipTextActive]}>
                  {d==='all'?'Все': d==='easy'?'Легко': d==='medium'?'Средне':'Сложно'}
                </Text>
              </TouchableOpacity>
            ))}
            {[
              {k:'price_asc', n:'Цена ↑'},
              {k:'price_desc', n:'Цена ↓'},
              {k:'days_asc', n:'Дни ↑'},
              {k:'days_desc', n:'Дни ↓'},
            ].map(s => (
              <TouchableOpacity key={s.k} style={[styles.chip, sort===s.k && styles.chipActive]} onPress={()=>setSort(s.k as any)}>
                <Text style={[styles.chipText, sort===s.k && styles.chipTextActive]}>{s.n}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.list}>
          {filtered.map(t => (
            <TouchableOpacity key={t.id} style={styles.card} onPress={() => { track('view_item', { id: t.id }); router.push(`/tours/${t.id}`); }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{t.title}</Text>
                <Text style={styles.cardSub}>{t.days} дн • {t.difficulty} • {t.price} ₽</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { flex: 1 },
  header: { padding: 20, backgroundColor: '#0891b2', alignItems: 'center' },
  title: { color: '#fff', fontSize: 22, fontWeight: '700' },
  filters: { padding: 20 },
  searchBar: { backgroundColor:'#fff', flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingVertical:12, borderRadius:12 },
  input: { marginLeft: 12, flex: 1 },
  chip: { backgroundColor:'#fff', paddingHorizontal:14, paddingVertical:8, borderRadius:20, marginRight:10 },
  chipActive: { backgroundColor:'#0891b2' },
  chipText: { color:'#64748b', fontWeight:'600' },
  chipTextActive: { color:'#fff' },
  list: { padding: 20, gap: 10 },
  card: { backgroundColor:'#fff', borderRadius:12, padding:16, flexDirection:'row', alignItems:'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: 16, fontWeight: '700', color:'#1e293b' },
  cardSub: { fontSize: 14, color:'#64748b', marginTop: 4 },
  iconBtn: { marginLeft: 8 },
  aiBtn: { backgroundColor:'#0891b2', paddingHorizontal:12, paddingVertical:10, borderRadius:10, flexDirection:'row', alignItems:'center', gap: 8 },
  aiBtnText: { color:'#fff', fontWeight:'700' },
});

