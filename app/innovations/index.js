import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const sampleInnovations = [
  {
    id: 'ai-monitoring',
    title: 'AI-мониторинг инфраструктуры',
    summary: 'Модель обнаруживает аномалии в телеметрии, предсказывает инциденты и снижает время простоя.',
    impact: '−35% инцидентов, +18% uptime SLO',
    tags: ['AI', 'Observability', 'Ops'],
  },
  {
    id: 'digital-twin',
    title: 'Цифровой двойник процессов',
    summary: 'Симуляция производственных сценариев с быстрым A/B-тестированием изменений.',
    impact: '−22% издержек, +14% throughput',
    tags: ['Simulation', 'Twin', 'Prod'],
  },
  {
    id: 'ml-quality',
    title: 'ML-контроль качества по фото',
    summary: 'Компьютерное зрение оценивает дефекты в фотоотчётах и формирует рекомендации.',
    impact: '−28% брака, +2.1x скорость приёмки',
    tags: ['CV', 'QC', 'Automation'],
  },
  {
    id: 'edge-iot',
    title: 'Edge IoT c локальными моделями',
    summary: 'Инференс на краю снижает латентность и зависимость от канала.',
    impact: '−40% latency, офлайн-устойчивость',
    tags: ['IoT', 'Edge', 'Latency'],
  },
];

function InnovationCard({ item }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardSummary}>{item.summary}</Text>
      <Text style={styles.cardImpact}>{item.impact}</Text>
      <View style={styles.tagRow}>
        {item.tags.map((t) => (
          <View key={t} style={styles.tag}>
            <Text style={styles.tagText}>{t}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function InnovationsScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState(null);

  const tags = useMemo(() => {
    const s = new Set();
    sampleInnovations.forEach((i) => i.tags.forEach((t) => s.add(t)));
    return Array.from(s);
  }, []);

  const filtered = useMemo(() => {
    return sampleInnovations.filter((i) => {
      const matchesQuery = query.trim().length === 0 ||
        i.title.toLowerCase().includes(query.toLowerCase()) ||
        i.summary.toLowerCase().includes(query.toLowerCase());
      const matchesTag = !activeTag || i.tags.includes(activeTag);
      return matchesQuery && matchesTag;
    });
  }, [query, activeTag]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Передовые идеи и результаты реализаций</Text>
      <Text style={styles.subtitle}>Обновляется по мере выхода новых пилотов и внедрений</Text>

      <View style={styles.searchRow}>
        <TextInput
          placeholder="Поиск по идеям и кейсам"
          value={query}
          onChangeText={setQuery}
          style={styles.search}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsScroll}>
        <Pressable onPress={() => setActiveTag(null)} style={[styles.tagFilter, !activeTag && styles.tagFilterActive]}>
          <Text style={[styles.tagFilterText, !activeTag && styles.tagFilterTextActive]}>Все</Text>
        </Pressable>
        {tags.map((t) => (
          <Pressable key={t} onPress={() => setActiveTag(t)} style={[styles.tagFilter, activeTag === t && styles.tagFilterActive]}>
            <Text style={[styles.tagFilterText, activeTag === t && styles.tagFilterTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => {}}>
            <InnovationCard item={item} />
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#f7f7fa',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#6b7280',
    marginBottom: 12,
  },
  searchRow: {
    marginBottom: 8,
  },
  search: {
    backgroundColor: 'white',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  tagsScroll: {
    marginVertical: 8,
  },
  tagFilter: {
    backgroundColor: 'white',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 999,
  },
  tagFilterActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  tagFilterText: {
    color: '#111827',
    fontWeight: '600',
  },
  tagFilterTextActive: {
    color: 'white',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardSummary: {
    color: '#374151',
    marginBottom: 6,
  },
  cardImpact: {
    color: '#059669',
    fontWeight: '600',
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '600',
  },
});

