import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

export default function TestApp() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#4A90E2" />
      <Text style={styles.text}>Storm Chaser App</Text>
      <Text style={styles.subtext}>Test Screen - App is working!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  subtext: {
    fontSize: 18,
    color: 'white',
    opacity: 0.8,
  },
});