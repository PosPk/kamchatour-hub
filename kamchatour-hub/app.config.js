module.exports = ({ config }) => {
  const channel = process.env.EXPO_UPDATES_CHANNEL || 'production';
  return {
    ...config,
    name: 'Kamchatour Hub',
    slug: 'kamchatour-hub',
    owner: 'pos-servis',
    version: '0.1.0',
    orientation: 'portrait',
    assetBundlePatterns: ['**/*'],
    extra: {
      eas: {
        projectId: '34abf0cb-fdf3-48b7-b93a-129e3ba369b0'
      }
    },
    runtimeVersion: { policy: 'appVersion' },
    updates: {
      url: 'https://u.expo.dev/34abf0cb-fdf3-48b7-b93a-129e3ba369b0',
      requestHeaders: {
        'expo-channel-name': channel
      }
    },
    android: {
      package: 'ru.posservis.kamchatourhub'
    },
    ios: {
      bundleIdentifier: 'ru.posservis.kamchatourhub'
    }
  };
};