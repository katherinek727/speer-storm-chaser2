/**
 * Storm Chaser App - Home Screen Only
 * A mobile application for storm chasing hobbyist meteorologists
 * @format
 */

import React from 'react';
import { 
  StatusBar, 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';

// Simple colors
const COLORS = {
  primary: '#4A90E2',
  primaryDark: '#357ABD',
  secondary: '#50E3C2',
  accent: '#FF6B6B',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  text: '#333333',
  textLight: '#666666',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
};

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Storm Chaser</Text>
          <Text style={styles.headerSubtitle}>Professional Storm Tracking</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Active Storms</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Warnings</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Weather', 'Weather feature would open here')}
            >
              <View style={[styles.actionIcon, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.actionText}>Weather</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Document', 'Storm documentation feature would open here')}
            >
              <View style={[styles.actionIcon, { backgroundColor: COLORS.secondary }]} />
              <Text style={styles.actionText}>Document</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Gallery', 'Storm gallery would open here')}
            >
              <View style={[styles.actionIcon, { backgroundColor: COLORS.accent }]} />
              <Text style={styles.actionText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Map', 'Storm map would open here')}
            >
              <View style={[styles.actionIcon, { backgroundColor: COLORS.info }]} />
              <Text style={styles.actionText}>Map</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <Text style={styles.activityTitle}>Thunderstorm detected</Text>
            <Text style={styles.activityTime}>2 hours ago • 40 miles away</Text>
          </View>
          <View style={styles.activityCard}>
            <Text style={styles.activityTitle}>Tornado warning issued</Text>
            <Text style={styles.activityTime}>4 hours ago • 25 miles away</Text>
          </View>
          <View style={styles.activityCard}>
            <Text style={styles.activityTitle}>Heavy rainfall alert</Text>
            <Text style={styles.activityTime}>6 hours ago • 15 miles away</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: -24,
  },
  statCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  section: {
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionButton: {
    alignItems: 'center',
    width: '23%',
    marginBottom: 16,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});

export default App;