import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const baseUrlFromEnv = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';
  const envFromEnv = process.env.EXPO_PUBLIC_ENV ?? '';

  const normalizedBaseUrl = useMemo(() => {
    if (!baseUrlFromEnv) return '';
    return baseUrlFromEnv.replace(/\/+$/, '');
  }, [baseUrlFromEnv]);

  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [responseText, setResponseText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [httpStatusCode, setHttpStatusCode] = useState(null);
  const [requestDurationMs, setRequestDurationMs] = useState(null);
  const [requestTimestampIso, setRequestTimestampIso] = useState('');

  const requestUrl = useMemo(() => {
    if (!normalizedBaseUrl) return '';
    return `${normalizedBaseUrl}/health`;
  }, [normalizedBaseUrl]);

  const runHealthCheck = useCallback(async () => {
    if (!normalizedBaseUrl) {
      setStatus('error');
      setErrorMessage('EXPO_PUBLIC_API_BASE_URL is not set');
      return;
    }

    try {
      setStatus('loading');
      setErrorMessage('');
      setResponseText('');
      setHttpStatusCode(null);
      setRequestDurationMs(null);
      setRequestTimestampIso(new Date().toISOString());

      const startAtMs = Date.now();
      const response = await fetch(requestUrl);
      const text = await response.text();
      const durationMs = Date.now() - startAtMs;

      setHttpStatusCode(response.status);
      setRequestDurationMs(durationMs);
      setResponseText(text);

      if (!response.ok) {
        setErrorMessage(`HTTP ${response.status}`);
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      setStatus('error');
    }
  }, [requestUrl]);

  useEffect(() => {
    runHealthCheck();
  }, [runHealthCheck]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Проверка окружения</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Окружение</Text>
        <Text style={styles.mono}>{envFromEnv || '(не задано)'}</Text>

        <Text style={[styles.label, { marginTop: 12 }]}>EXPO_PUBLIC_API_BASE_URL</Text>
        <Text style={styles.mono} numberOfLines={2}>
          {normalizedBaseUrl || '(не задано)'}
        </Text>
      </View>

      <View style={[styles.card, { marginTop: 16 }]}>
        <Text style={styles.label}>Отчет</Text>
        <Text style={styles.mono}>URL запроса: {requestUrl || '-'}</Text>
        <Text style={styles.mono}>HTTP статус: {httpStatusCode ?? '-'}</Text>
        <Text style={styles.mono}>Длительность: {requestDurationMs != null ? `${requestDurationMs} мс` : '-'}</Text>
        <Text style={styles.mono}>Время: {requestTimestampIso || '-'}</Text>
        {status === 'loading' && (
          <View style={styles.rowCenter}>
            <ActivityIndicator />
            <Text style={{ marginLeft: 8 }}>Выполняется...</Text>
          </View>
        )}
        {status === 'success' && (
          <View>
            <Text style={styles.success}>Успех</Text>
            <Text style={styles.mono} numberOfLines={4}>{responseText}</Text>
          </View>
        )}
        {status === 'error' && (
          <View>
            <Text style={styles.error}>Ошибка</Text>
            <Text style={styles.mono} numberOfLines={4}>{errorMessage}</Text>
          </View>
        )}

        <Pressable onPress={runHealthCheck} style={styles.button}>
          <Text style={styles.buttonText}>Повторить</Text>
        </Pressable>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  card: {
    width: '100%',
    maxWidth: 560,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fafafa',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mono: {
    fontFamily: 'System',
    color: '#111',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  success: {
    color: '#0a7',
    marginBottom: 6,
    fontWeight: '600',
  },
  error: {
    color: '#d33',
    marginBottom: 6,
    fontWeight: '600',
  },
  button: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#111',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
