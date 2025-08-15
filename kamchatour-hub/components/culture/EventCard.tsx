import React from 'react';
import { View, Text } from 'react-native';

type Props = { title: string; location: string; month?: string };

function Card({ title, location, month }: Props) {
	return (
		<View>
			<Text>{title}</Text>
			<Text>{location}</Text>
			{month ? <Text>{month}</Text> : null}
		</View>
	);
}

export default React.memo(Card);