import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../../hooks/useFavorites';

export default function FavoritesScreen() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Избранное</Text>
          {favorites.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearFavorites}>
              <Text style={styles.clearText}>Очистить</Text>
            </TouchableOpacity>
          )}
        </View>

        {favorites.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>Пока нет избранных</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {favorites.map(item => (
              <View key={`${item.kind}-${item.id}`} style={styles.card}>
                <View style={styles.cardLeft}>
                  <Text style={styles.emoji}>{item.emoji || '⭐'}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{item.title}</Text>
                    {!!item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}
                    <Text style={styles.kind}>{labelByKind(item.kind)}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => removeFavorite(item.id, item.kind)}>
                  <Ionicons name="heart" size={22} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function labelByKind(kind: 'tours' | 'activities' | 'accommodations') {
  switch (kind) {
    case 'tours':
      return 'Тур';
    case 'activities':
      return 'Активность';
    case 'accommodations':
      return 'Проживание';
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollView: { flex: 1 },
  header: { padding: 20, backgroundColor: '#0891b2', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  clearButton: { position: 'absolute', right: 20, top: 20 },
  clearText: { color: '#e0f2fe', fontSize: 14 },
  empty: { alignItems: 'center', marginTop: 40, gap: 12 },
  emptyText: { color: '#64748b' },
  list: { padding: 20, gap: 12 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  emoji: { fontSize: 28 },
  title: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  subtitle: { fontSize: 14, color: '#64748b' },
  kind: { marginTop: 2, fontSize: 12, color: '#64748b' },
});

