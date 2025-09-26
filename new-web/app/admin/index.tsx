import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoles } from '../../contexts/RoleContext';

export default function AdminCabinet() {
	const { hasRole } = useRoles();
	if (!hasRole('admin')) return <View style={styles.center}><Text>Нет доступа</Text></View>;
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Админ-панель</Text>
			<Text>Пользователи, роли, мониторинг</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20 },
	title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
	center: { flex:1, alignItems:'center', justifyContent:'center' },
});

