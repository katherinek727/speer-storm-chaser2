/**
 * Home Screen - Main navigation hub for Storm Chaser app
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const menuItems = [
    {
      id: 'weather',
      title: 'Weather Data',
      description: 'View current weather conditions and forecasts',
      icon: 'weather-partly-cloudy',
      color: COLORS.primary,
      route: 'Weather' as keyof RootStackParamList,
    },
    {
      id: 'document',
      title: 'Document Storm',
      description: 'Capture and document storm events with photos',
      icon: 'camera',
      color: COLORS.secondary,
      route: 'StormDocumentation' as keyof RootStackParamList,
    },
    {
      id: 'gallery',
      title: 'Storm Gallery',
      description: 'Browse your documented storm events',
      icon: 'image-multiple',
      color: COLORS.accent,
      route: 'StormGallery' as keyof RootStackParamList,
    },
    {
      id: 'map',
      title: 'Storm Map',
      description: 'View storm locations on a map (Coming Soon)',
      icon: 'map',
      color: '#9C27B0',
      route: 'Home' as keyof RootStackParamList,
      disabled: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Icon name="weather-tornado" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Storm Chaser</Text>
          <Text style={styles.subtitle}>
            Track and document weather events like a pro
          </Text>
        </View>

        {/* Welcome Card */}
        <View style={[styles.card, SHADOWS.md]}>
          <View style={styles.welcomeHeader}>
            <Icon name="weather-cloudy" size={24} color={COLORS.primary} />
            <Text style={styles.welcomeTitle}>Welcome, Meteorologist!</Text>
          </View>
          <Text style={styles.welcomeText}>
            Ready to track some weather? Use this app to monitor current
            conditions, document storm events, and build your storm chasing
            portfolio.
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, SHADOWS.sm]}>
            <Icon name="lightning-bolt" size={24} color={COLORS.warning} />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Storms Documented</Text>
          </View>
          <View style={[styles.statCard, SHADOWS.sm]}>
            <Icon name="thermometer" size={24} color={COLORS.error} />
            <Text style={styles.statNumber}>--°</Text>
            <Text style={styles.statLabel}>Current Temp</Text>
          </View>
          <View style={[styles.statCard, SHADOWS.sm]}>
            <Icon name="map-marker" size={24} color={COLORS.success} />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Locations</Text>
          </View>
        </View>

        {/* Main Menu */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Features</Text>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                SHADOWS.sm,
                item.disabled && styles.menuItemDisabled,
              ]}
              onPress={() => !item.disabled && navigation.navigate(item.route)}
              disabled={item.disabled}>
              <View
                style={[styles.menuIconContainer, { backgroundColor: item.color }]}>
                <Icon name={item.icon} size={24} color="#FFFFFF" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemDescription}>
                  {item.description}
                </Text>
              </View>
              {!item.disabled && (
                <Icon name="chevron-right" size={24} color={COLORS.textLight} />
              )}
              {item.disabled && (
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>Soon</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Stay safe while storm chasing! Always prioritize safety over
            documentation.
          </Text>
          <View style={styles.safetyTips}>
            <Icon name="shield-check" size={16} color={COLORS.success} />
            <Text style={styles.safetyText}>Safety First</Text>
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
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  headerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  welcomeTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  welcomeText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
  },
  statNumber: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginVertical: SPACING.xs,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  menuContainer: {
    marginBottom: SPACING.xl,
  },
  menuTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  menuItemDisabled: {
    opacity: 0.6,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  menuContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  menuItemDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
  },
  comingSoonBadge: {
    backgroundColor: COLORS.textLighter,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  comingSoonText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.surface,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  footer: {
    alignItems: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    fontStyle: 'italic',
  },
  safetyTips: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  safetyText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.success,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginLeft: SPACING.xs,
  },
});

export default HomeScreen;