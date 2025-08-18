import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function CreateReportScreen() {
  const [title, setTitle] = useState('');
  const [photos, setPhotos] = useState([]);

  async function pickFromLibrary() {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!res.canceled) {
      const selected = res.assets.map((a) => ({ uri: a.uri }));
      setPhotos((p) => [...p, ...selected]);
    }
  }

  async function pickFromCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Нет доступа к камере', 'Разрешите доступ к камере в настройках.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!res.canceled) {
      const selected = res.assets.map((a) => ({ uri: a.uri }));
      setPhotos((p) => [...p, ...selected]);
    }
  }

  async function save() {
    try {
      const raw = await AsyncStorage.getItem('reports:v1');
      const list = raw ? JSON.parse(raw) : [];
      const report = {
        id: `r_${Date.now()}`,
        title: title.trim(),
        photos: photos,
        createdAt: Date.now(),
      };
      const updated = [report, ...list];
      await AsyncStorage.setItem('reports:v1', JSON.stringify(updated));
      router.replace('/reports');
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось сохранить отчёт');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Новый фотоотчёт</Text>
      <TextInput
        style={styles.input}
        placeholder="Название (необязательно)"
        value={title}
        onChangeText={setTitle}
      />

      <View style={styles.row}>
        <Pressable style={styles.action} onPress={pickFromCamera}>
          <Text style={styles.actionText}>Сделать фото</Text>
        </Pressable>
        <Pressable style={styles.action} onPress={pickFromLibrary}>
          <Text style={styles.actionText}>Выбрать из галереи</Text>
        </Pressable>
      </View>

      <View style={styles.grid}>
        {photos.map((p, idx) => (
          <Image key={`${p.uri}_${idx}`} source={{ uri: p.uri }} style={styles.thumb} />
        ))}
      </View>

      <Pressable style={[styles.action, styles.primary]} onPress={save} disabled={photos.length === 0}>
        <Text style={styles.primaryText}>{photos.length === 0 ? 'Добавьте фото' : 'Сохранить отчёт'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f7f7fa',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'white',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  action: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionText: {
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  thumb: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  primary: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  primaryText: {
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
  },
});

