/**
 * Storm Chaser App
 * A mobile application for storm chasing hobbyist meteorologists
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY } from './src/constants';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import WeatherScreen from './src/screens/WeatherScreen';
import StormDocumentationScreen from './src/screens/StormDocumentationScreen';
import StormGalleryScreen from './src/screens/StormGalleryScreen';
import MapScreen from './src/screens/MapScreen';

// Import navigation types
import { RootStackParamList } from './src/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const screenOptions = {
    headerStyle: {
      backgroundColor: COLORS.primary,
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTintColor: COLORS.surface,
    headerTitleStyle: {
      fontSize: TYPOGRAPHY.fontSize.lg,
      fontWeight: TYPOGRAPHY.fontWeight.bold as 'bold',
    },
    headerTitleAlign: 'center' as 'center',
    cardStyle: {
      backgroundColor: COLORS.background,
    },
    headerBackTitleVisible: false,
  };

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={COLORS.primary}
        translucent={false}
      />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Storm Chaser' }}
          />
          <Stack.Screen
            name="Weather"
            component={WeatherScreen}
            options={{ title: 'Weather Data' }}
          />
          <Stack.Screen
            name="StormDocumentation"
            component={StormDocumentationScreen}
            options={{ title: 'Document Storm' }}
          />
          <Stack.Screen
            name="StormGallery"
            component={StormGalleryScreen}
            options={{ title: 'Storm Gallery' }}
          />
          <Stack.Screen
            name="Map"
            component={MapScreen}
            options={{ title: 'Storm Map' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;