/**
 * Test App - Minimal version for debugging
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#4A90E2" />
      <View style={styles.content}>
        <Text style={styles.title}>Storm Chaser</Text>
        <Text style={styles.subtitle}>App is running</Text>
        <Text style={styles.message}>If you can see this, the app is working.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#4A90E2',
    textAlign: 'center',
  },
});

export default App;