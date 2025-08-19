import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  Pressable
} from 'react-native';
import { BACKEND, startMockQuantumJob } from './src/services/quantumJobs';
import { formatMsCompactRu, formatProgressPercent } from './src/utils/time';

export default function App() {
  const [useQpu, setUseQpu] = useState(false);
  const [shotsInput, setShotsInput] = useState('2000');
  const [jobState, setJobState] = useState(null);
  const cancelRef = useRef(null);

  const backend = useMemo(() => (useQpu ? BACKEND.QPU : BACKEND.SIMULATOR), [useQpu]);
  const isRunning = jobState ? (jobState.status === 'queued' || jobState.status === 'running') : false;

  const startJob = () => {
    if (cancelRef.current) {
      cancelRef.current();
      cancelRef.current = null;
    }
    const parsedShots = parseInt(shotsInput, 10);
    const shots = Number.isFinite(parsedShots) && parsedShots > 0 ? parsedShots : 2000;
    const cancel = startMockQuantumJob({ backend, shots }, (update) => setJobState(update));
    cancelRef.current = cancel;
  };

  const cancelJob = () => {
    if (cancelRef.current) {
      cancelRef.current();
      cancelRef.current = null;
    }
  };

  const clearJob = () => {
    setJobState(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Квантовая задача</Text>
        <Text style={styles.subtitle}>Выберите режим и запустите. Следите за статусом и ETA.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Режим:</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Симулятор</Text>
            <Switch value={useQpu} onValueChange={setUseQpu} />
            <Text style={styles.switchLabel}>QPU</Text>
          </View>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.label}>Shots:</Text>
          <TextInput
            style={styles.input}
            value={shotsInput}
            onChangeText={setShotsInput}
            inputMode="numeric"
            keyboardType="numeric"
            placeholder="2000"
          />
        </View>

        <View style={styles.actions}>
          <Pressable style={[styles.button, isRunning && styles.buttonDisabled]} disabled={isRunning} onPress={startJob}>
            <Text style={styles.buttonText}>{useQpu ? 'Запустить на QPU' : 'Быстрый симулятор'}</Text>
          </Pressable>
          {isRunning ? (
            <Pressable style={[styles.buttonSecondary]} onPress={cancelJob}>
              <Text style={styles.buttonSecondaryText}>Отменить</Text>
            </Pressable>
          ) : (
            <Pressable style={[styles.buttonSecondary]} onPress={clearJob}>
              <Text style={styles.buttonSecondaryText}>Очистить</Text>
            </Pressable>
          )}
        </View>
      </View>

      {jobState && (
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Статус:</Text>
            <View style={styles.statusRow}>
              {isRunning && <ActivityIndicator size="small" color="#2563eb" style={{ marginRight: 8 }} />}
              <Text style={[styles.status, styles[`status_${jobState.status}`]]}>{jobState.status}</Text>
            </View>
          </View>

          {(jobState.status === 'queued' || jobState.status === 'running') && (
            <View style={{ marginTop: 8 }}>
              <View style={styles.progressBarOuter}>
                <View style={[styles.progressBarInner, { width: `${Math.round((jobState.progress || 0) * 100)}%` }]} />
              </View>
              <View style={styles.rowBetween}>
                <Text style={styles.meta}>Прогресс: {formatProgressPercent(jobState.progress || 0)}</Text>
                <Text style={styles.meta}>ETA: ≈ {formatMsCompactRu(jobState.etaMs || 0)}</Text>
              </View>
            </View>
          )}

          <View style={{ marginTop: 8 }}>
            <Text style={styles.meta}>Идентификатор: {jobState.jobId}</Text>
            <Text style={styles.meta}>Бэкенд: {backend === 'qpu' ? 'QPU (точнее/дольше)' : 'Симулятор (быстро)'}</Text>
            <Text style={styles.meta}>Shots: {jobState.shots}</Text>
            {jobState.metrics && (
              <Text style={styles.meta}>
                Очередь: {formatMsCompactRu(jobState.metrics.queueMs)}, Выполнение: {formatMsCompactRu(jobState.metrics.runMs)}
              </Text>
            )}
          </View>

          {jobState.status === 'completed' && jobState.result && (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.label}>Результат</Text>
              <Text style={styles.result}>cut_value: {jobState.result.solution.cut_value}</Text>
              <Text style={styles.result}>assignment: [{jobState.result.solution.assignment.join(', ')}]</Text>
            </View>
          )}

          {jobState.status === 'failed' && jobState.error && (
            <View style={{ marginTop: 12 }}>
              <Text style={[styles.status, styles.status_failed]}>Ошибка: {jobState.error.message}</Text>
            </View>
          )}
        </View>
      )}

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
    paddingHorizontal: 16,
    paddingTop: 16
  },
  header: {
    marginBottom: 12
  },
  title: {
    color: '#e5e7eb',
    fontSize: 20,
    fontWeight: '600'
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 4
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1f2937'
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  switchLabel: {
    color: '#e5e7eb',
    marginHorizontal: 8
  },
  label: {
    color: '#e5e7eb',
    fontWeight: '600'
  },
  input: {
    backgroundColor: '#0b1220',
    borderWidth: 1,
    borderColor: '#1f2937',
    color: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 100,
    textAlign: 'right'
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between'
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600'
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8
  },
  buttonSecondaryText: {
    color: '#93c5fd',
    fontWeight: '600'
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  status: {
    color: '#e5e7eb',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: 12
  },
  status_queued: { color: '#fbbf24' },
  status_running: { color: '#60a5fa' },
  status_completed: { color: '#34d399' },
  status_failed: { color: '#f87171' },
  status_cancelled: { color: '#94a3b8' },
  progressBarOuter: {
    height: 8,
    backgroundColor: '#0b1220',
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: 6
  },
  progressBarInner: {
    height: '100%',
    backgroundColor: '#3b82f6'
  },
  meta: {
    color: '#94a3b8',
    fontSize: 12
  },
  result: {
    color: '#e5e7eb',
    fontSize: 12
  }
});
