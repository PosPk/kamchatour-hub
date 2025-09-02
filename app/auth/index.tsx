import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'expo-router';

export default function AuthIndex() {
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('demo@kamchatka.ru');
  const [password, setPassword] = useState('demo123');
  const [name, setName] = useState('Демо Пользователь');
  const [mode, setMode] = useState<'login'|'register'>('login');

  const onSubmit = async () => {
    try {
      if (mode === 'login') {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password, name.trim());
      }
      router.replace('/(tabs)/profile');
    } catch (e: any) {
      Alert.alert('Ошибка', e?.message || 'Не удалось выполнить операцию');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mode === 'login' ? 'Вход' : 'Регистрация'}</Text>
      {mode === 'register' && (
        <TextInput style={styles.input} placeholder='Имя' value={name} onChangeText={setName} />
      )}
      <TextInput style={styles.input} placeholder='Email' autoCapitalize='none' keyboardType='email-address' value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder='Пароль' secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.btn} onPress={onSubmit}>
        <Text style={styles.btnText}>{mode === 'login' ? 'Войти' : 'Зарегистрироваться'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=> setMode(mode==='login'?'register':'login')}>
        <Text style={styles.link}>{mode==='login'?'Нет аккаунта? Регистрация':'Уже есть аккаунт? Войти'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginBottom: 12, textAlign:'center' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10 },
  btn: { backgroundColor: '#0891b2', paddingVertical: 12, borderRadius: 10, alignItems:'center', marginTop: 4 },
  btnText: { color: '#fff', fontWeight: '700' },
  link: { color: '#0891b2', textAlign:'center', marginTop: 12 },
});

