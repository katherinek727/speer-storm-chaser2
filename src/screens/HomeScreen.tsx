/**
 * Home Screen - Main navigation hub for Storm Chaser app
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../src/types/navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import StatCard from '../components/StatCard';
import FeatureCard from '../components/FeatureCard';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [stats, setStats] = React.useState({
    stormCount: 0,
    currentTemp: '--°',
    locationCount: 0,
    activeAlerts: 0,
  });

  const features = [
    {
      id: 'weather',
      title: 'Weather Data',
      description: 'View current weather conditions and forecasts',
      icon: 'weather-partly-cloudy',
      color: COLORS.primary,
      route: 'Weather' as const,
    },
    {
      id: 'document',
      title: 'Document Storm',
      description: 'Capture and document storm events with photos',
      icon: 'camera',
      color: COLORS.secondary,
      route: 'StormDocumentation' as const,
    },
    {
      id: 'gallery',
      title: 'Storm Gallery',
      description: 'Browse your documented storm events',
      icon: 'image-multiple',
      color: COLORS.accent,
      route: 'StormGallery' as const,
    },
    {
      id: 'map',
      title: 'Storm Map',
      description: 'View storm locations on interactive maps',
      icon: 'map',
      color: '#9C27B0',
      route: 'Home' as const,
      comingSoon: true,
    },
    {
      id: 'alerts',
      title: 'Weather Alerts',
      description: 'Get notified about severe weather conditions',
      icon: 'alert',
      color: COLORS.warning,
      route: 'Home' as const,
      comingSoon: true,
    },
    {
      id: 'analytics',
      title: 'Storm Analytics',
      description: 'Analyze patterns in your storm documentation',
      icon: 'chart-line',
      color: COLORS.info,
      route: 'Home' as const,
      comingSoon: true,
    },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setStats({
        ...stats,
        stormCount: Math.floor(Math.random() * 10),
        currentTemp: `${Math.floor(Math.random() * 30) + 60}°`,
        locationCount: Math.floor(Math.random() * 5),
        activeAlerts: Math.floor(Math.random() * 3),
      });
      setRefreshing(false);
    }, 1000);
  }, [stats]);

  React.useEffect(() => {
    // Initial data load
    onRefresh();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Icon name="weather-tornado" size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Storm Chaser</Text>
          <Text style={styles.subtitle}>
            Professional storm tracking and documentation
          </Text>
        </View>

        {/* Welcome Card */}
        <View style={[styles.welcomeCard, SHADOWS.md]}>
          <View style={styles.welcomeHeader}>
            <Icon name="weather-cloudy" size={28} color={COLORS.primary} />
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeTitle}>Welcome, Storm Chaser!</Text>
              <Text style={styles.welcomeSubtitle}>
                Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
          <Text style={styles.welcomeText}>
            Monitor real-time weather conditions, document storm events with
            photos and metadata, and build your professional storm chasing
            portfolio.
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Storms Documented"
              value={stats.stormCount}
              icon="lightning-bolt"
              color={COLORS.warning}
              trend="up"
              trendValue="+2"
              onPress={() => navigation.navigate('StormGallery' as any)}
            />
            <StatCard
              title="Current Temp"
              value={stats.currentTemp}
              icon="thermometer"
              color={COLORS.error}
              subtitle="Feels like 72°"
            />
            <StatCard
              title="Locations"
              value={stats.locationCount}
              icon="map-marker"
              color={COLORS.success}
              trend="neutral"
            />
            <StatCard
              title="Active Alerts"
              value={stats.activeAlerts}
              icon="alert"
              color={COLORS.accent}
              trend="down"
              trendValue="-1"
            />
          </View>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature) => (
              <FeatureCard
                key={feature.id}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                color={feature.color}
                comingSoon={feature.comingSoon}
                onPress={
                  !feature.comingSoon
                    ? () => navigation.navigate(feature.route as any)
                    : undefined
                }
              />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <View style={[styles.actionButton, { backgroundColor: COLORS.primary }]}>
              <Icon name="camera" size={24} color={COLORS.surface} />
              <Text style={styles.actionButtonText}>Document Now</Text>
            </View>
            <View style={[styles.actionButton, { backgroundColor: COLORS.secondary }]}>
              <Icon name="map-marker-radius" size={24} color={COLORS.surface} />
              <Text style={styles.actionButtonText}>Check Location</Text>
            </View>
            <View style={[styles.actionButton, { backgroundColor: COLORS.accent }]}>
              <Icon name="weather-cloudy" size={24} color={COLORS.surface} />
              <Text style={styles.actionButtonText}>Refresh Weather</Text>
            </View>
          </View>
        </View>

        {/* Safety Notice */}
        <View style={styles.safetyNotice}>
          <Icon name="shield-check" size={20} color={COLORS.success} />
          <View style={styles.safetyTextContainer}>
            <Text style={styles.safetyTitle}>Safety First</Text>
            <Text style={styles.safetyMessage}>
              Always prioritize personal safety over documentation. Maintain safe
              distance from severe weather events and follow local authorities'
              instructions.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  headerIconContainer: {
    width: 96,
    height: 96,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: `${COLORS.primary}30`,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textLight,
    textAlign: 'center',
    maxWidth: '80%',
  },
  welcomeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  welcomeTextContainer: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  welcomeTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  welcomeSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
  },
  welcomeText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  statsSection: {
    marginBottom: SPACING.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  featuresSection: {
    marginBottom: SPACING.xl,
  },
  featuresGrid: {
    gap: SPACING.md,
  },
  actionsSection: {
    marginBottom: SPACING.xl,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  actionButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.surface,
    marginLeft: SPACING.sm,
  },
  safetyNotice: {
    flexDirection: 'row',
    backgroundColor: `${COLORS.success}15`,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  safetyTextContainer: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  safetyTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.success,
    marginBottom: SPACING.xs,
  },
  safetyMessage: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text,
    lineHeight: 20,
  },
});

export default HomeScreen;