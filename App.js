import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>STORM CHASER</Text>
      <Text style={styles.message}>App is working!</Text>
      <Text style={styles.debug}>Blue background = success</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
  },
  debug: {
    fontSize: 16,
    color: '#FFD700',
    marginTop: 20,
  },
});

export default App;