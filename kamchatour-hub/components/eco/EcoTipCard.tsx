import React from 'react';
import { View, Text } from 'react-native';

type Props = { title: string; description?: string | undefined };

function EcoTipCard({ title, description }: Props) {
	return (
		<View>
			<Text>{title}</Text>
			{description ? <Text>{description}</Text> : null}
		</View>
	);
}

export default React.memo(EcoTipCard);