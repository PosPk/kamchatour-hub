import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ReportRow({ report }) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{report.title || 'Без названия'}</Text>
        <Text style={styles.rowMeta}>{new Date(report.createdAt).toLocaleString()}</Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{(report.photos || []).length}</Text>
      </View>
    </View>
  );
}

export default function ReportsScreen() {
  const [reports, setReports] = useState([]);

  async function loadReports() {
    try {
      const raw = await AsyncStorage.getItem('reports:v1');
      const parsed = raw ? JSON.parse(raw) : [];
      setReports(parsed.sort((a, b) => b.createdAt - a.createdAt));
    } catch (e) {
      console.warn('Failed to load reports', e);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      loadReports();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Фотоотчёты</Text>
        <Link href="/reports/create" asChild>
          <Pressable style={styles.cta}><Text style={styles.ctaText}>+ Новый</Text></Pressable>
        </Link>
      </View>

      {reports.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Пока нет ни одного фотоотчёта.</Text>
          <Link href="/reports/create" asChild>
            <Pressable style={styles.cta}><Text style={styles.ctaText}>Создать</Text></Pressable>
          </Link>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(r) => r.id}
          renderItem={({ item }) => <ReportRow report={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7fa',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  cta: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  ctaText: {
    color: 'white',
    fontWeight: '700',
  },
  empty: {
    backgroundColor: 'white',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  emptyText: {
    color: '#374151',
    marginBottom: 10,
  },
  row: {
    backgroundColor: 'white',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowTitle: {
    fontWeight: '700',
  },
  rowMeta: {
    color: '#6b7280',
  },
  badge: {
    backgroundColor: '#111827',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  badgeText: {
    color: 'white',
    fontWeight: '700',
  },
});

