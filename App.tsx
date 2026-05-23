/**
 * Storm Chaser App
 * A mobile application for storm chasing hobbyist meteorologists
 * @format
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, useColorScheme, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, TYPOGRAPHY } from './src/constants';

// Import gesture handler at the top
import 'react-native-gesture-handler';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import WeatherScreen from './src/screens/WeatherScreen';
import StormDocumentationScreen from './src/screens/StormDocumentationScreen';
import StormGalleryScreen from './src/screens/StormGalleryScreen';
import MapScreen from './src/screens/MapScreen';

// Import navigation types
import { RootStackParamList } from './src/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

// Custom splash screen component
const CustomSplashScreen = () => {
  return (
    <View style={styles.splashContainer}>
      <View style={styles.splashContent}>
        <View style={styles.splashIcon}>
          <View style={styles.splashIconOuter} />
          <View style={styles.splashIconInner} />
        </View>
        <Text style={styles.splashTitle}>Storm Chaser</Text>
        <Text style={styles.splashSubtitle}>Professional Storm Tracking</Text>
      </View>
    </View>
  );
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    // Hide splash screen after app is loaded
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 2000); // Show splash for 2 seconds

    return () => clearTimeout(timer);
  }, []);

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

  if (isSplashVisible) {
    return <CustomSplashScreen />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
  },
  splashIcon: {
    position: 'relative',
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  splashIconOuter: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'white',
    opacity: 0.9,
  },
  splashIconInner: {
    position: 'absolute',
    top: 40,
    left: 40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.secondary,
  },
  splashTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  splashSubtitle: {
    fontSize: 18,
    color: 'white',
    opacity: 0.8,
  },
});

export default App;