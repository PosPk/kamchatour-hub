import React from 'react';
import { View, Text } from 'react-native';

type Props = { name: string; craft: string; village?: string };

function Card({ name, craft, village }: Props) {
	return (
		<View>
			<Text>{name}</Text>
			<Text>{craft}</Text>
			{village ? <Text>{village}</Text> : null}
		</View>
	);
}

export default React.memo(Card);