import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: process.env.EXPO_PUBLIC_WEBAPP_URL || 'http://localhost:5173' }}
        style={{ flex: 1, width: '100%' }}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
      />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#10141f'
  },
});