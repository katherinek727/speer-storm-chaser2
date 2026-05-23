/**
 * Storm Chaser - Absolute Minimal Test
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Storm Chaser App</Text>
      <Text style={styles.subtext}>If you see this, app is working</Text>
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
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  subtext: {
    fontSize: 16,
    color: 'white',
    marginTop: 10,
  },
});