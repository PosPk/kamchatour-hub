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

  const [status, setStatus] = useState('idle');
  const [responseText, setResponseText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

      const response = await fetch(`${normalizedBaseUrl}/health`);
      const text = await response.text();
      setResponseText(text);
      setStatus('success');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      setStatus('error');
    }
  }, [normalizedBaseUrl]);

  useEffect(() => {
    runHealthCheck();
  }, [runHealthCheck]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Environment Check</Text>

      <View style={styles.card}>
        <Text style={styles.label}>ENV</Text>
        <Text style={styles.mono}>{envFromEnv || '(not set)'}</Text>

        <Text style={[styles.label, { marginTop: 12 }]}>EXPO_PUBLIC_API_BASE_URL</Text>
        <Text style={styles.mono} numberOfLines={2}>
          {normalizedBaseUrl || '(not set)'}
        </Text>
      </View>

      <View style={[styles.card, { marginTop: 16 }]}>
        <Text style={styles.label}>Health check</Text>
        {status === 'loading' && (
          <View style={styles.rowCenter}>
            <ActivityIndicator />
            <Text style={{ marginLeft: 8 }}>Checking...</Text>
          </View>
        )}
        {status === 'success' && (
          <View>
            <Text style={styles.success}>Success</Text>
            <Text style={styles.mono} numberOfLines={4}>{responseText}</Text>
          </View>
        )}
        {status === 'error' && (
          <View>
            <Text style={styles.error}>Error</Text>
            <Text style={styles.mono} numberOfLines={4}>{errorMessage}</Text>
          </View>
        )}

        <Pressable onPress={runHealthCheck} style={styles.button}>
          <Text style={styles.buttonText}>Retry</Text>
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
