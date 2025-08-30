import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoles } from '../../contexts/RoleContext';

export default function TransferCabinet() {
	const { hasRole } = useRoles();
	if (!hasRole('transfer')) return <View style={styles.center}><Text>Нет доступа</Text></View>;
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Кабинет трансфера</Text>
			<Text>Расписания, транспорт и места</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20 },
	title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
	center: { flex:1, alignItems:'center', justifyContent:'center' },
});

