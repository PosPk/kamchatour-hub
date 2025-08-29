import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const PDF_URL = 'https://disk.yandex.ru/i/Mtwi32M27f5FvA';

export default function DocsScreen() {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <iframe
          src={PDF_URL}
          style={{ border: 'none', width: '100%', height: '100%' }}
          title="Документ"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView source={{ uri: PDF_URL }} style={{ flex: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

