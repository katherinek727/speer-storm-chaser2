module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null,
        android: null,
      },
    },
    'react-native-maps': {
      platforms: {
        android: null, // disable autolinking for Android, we'll handle it manually
      },
    },
    'react-native-camera': {
      platforms: {
        android: null,
      },
    },
  },
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/fonts/'],
};