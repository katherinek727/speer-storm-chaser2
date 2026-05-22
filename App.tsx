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

// Import screens (to be created)
import HomeScreen from './src/screens/HomeScreen';
import WeatherScreen from './src/screens/WeatherScreen';
import StormDocumentationScreen from './src/screens/StormDocumentationScreen';
import StormGalleryScreen from './src/screens/StormGalleryScreen';

export type RootStackParamList = {
  Home: undefined;
  Weather: undefined;
  StormDocumentation: undefined;
  StormGallery: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4A90E2',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            cardStyle: {
              backgroundColor: '#F5F7FA',
            },
          }}>
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
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;