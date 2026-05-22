/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: import explicitly to use the types shipped with jest.
import {it} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

// Simple mock for react-native-gesture-handler to prevent native module errors
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    GestureHandlerRootView: View,
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    PanGestureHandler: View,
    TapGestureHandler: View,
    LongPressGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    FlingGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    ScrollView: View,
    Switch: View,
    TextInput: View,
    DrawerLayoutAndroid: View,
  };
});

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: View,
    Marker: View,
    Callout: View,
    PROVIDER_GOOGLE: 'google',
  };
});

// Mock react-native-camera
jest.mock('react-native-camera', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    RNCamera: View,
  };
});

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock react-native-permissions
jest.mock('react-native-permissions', () => ({
  check: jest.fn(),
  request: jest.fn(),
  PERMISSIONS: {},
  RESULTS: {},
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: any) => children,
  SafeAreaView: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: any) => children,
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({}),
}));

// Mock @react-navigation/stack
jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }: any) => children,
    Screen: ({ component: Component, ...props }: any) => <Component {...props} />,
  }),
}));

// Mock screens to simplify testing
jest.mock('../src/screens/HomeScreen', () => 'HomeScreen');
jest.mock('../src/screens/WeatherScreen', () => 'WeatherScreen');
jest.mock('../src/screens/StormDocumentationScreen', () => 'StormDocumentationScreen');
jest.mock('../src/screens/StormGalleryScreen', () => 'StormGalleryScreen');
jest.mock('../src/screens/MapScreen', () => 'MapScreen');

// Mock services
jest.mock('../src/services/openMeteoService', () => ({
  getCurrentWeather: jest.fn(),
  getHourlyForecast: jest.fn(),
}));

jest.mock('../src/services/storageService', () => ({
  getStormDocuments: jest.fn(),
  saveStormDocument: jest.fn(),
  getStorageStats: jest.fn(),
}));

jest.mock('../src/services/cameraService', () => ({
  checkCameraPermissions: jest.fn(),
  checkLocationPermissions: jest.fn(),
  takePhoto: jest.fn(),
  DEFAULT_CAMERA_CONFIG: {},
}));

jest.mock('../src/services/mapService', () => ({
  convertStormsToMarkers: jest.fn(),
  calculateMapRegion: jest.fn(),
  clusterMarkers: jest.fn(),
  calculateDistance: jest.fn(),
  formatCoordinate: jest.fn(),
  getStormTypeDistribution: jest.fn(),
}));

// Suppress console warnings
beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

it('renders correctly', () => {
  renderer.create(<App />);
});

it('creates app instance without crashing', () => {
  const tree = renderer.create(<App />);
  expect(tree).toBeTruthy();
});

it('matches snapshot', () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});