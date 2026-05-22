/**
 * Weather Screen - Displays current weather data
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';

type WeatherScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Weather'>;

interface Props {
  navigation: WeatherScreenNavigationProp;
}

const WeatherScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = React.useState(true);
  const [weatherData, setWeatherData] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
      setError('Weather API integration required');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Fetching weather data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.errorContainer}>
            <Icon name="weather-cloudy-alert" size={64} color={COLORS.error} />
            <Text style={styles.errorTitle}>Weather Data Unavailable</Text>
            <Text style={styles.errorMessage}>
              {error}. Please check your internet connection or try again later.
            </Text>
          </View>

          {/* Mock Weather Data for demonstration */}
          <View style={styles.mockSection}>
            <Text style={styles.sectionTitle}>Sample Weather Data</Text>
            <Text style={styles.mockNote}>
              (Mock data - Real API integration needed)
            </Text>

            <View style={[styles.weatherCard, SHADOWS.md]}>
              <View style={styles.weatherHeader}>
                <Icon name="map-marker" size={20} color={COLORS.primary} />
                <Text style={styles.locationText}>Current Location</Text>
              </View>

              <View style={styles.temperatureContainer}>
                <Text style={styles.temperature}>72°</Text>
                <Text style={styles.condition}>Partly Cloudy</Text>
              </View>

              <View style={styles.weatherGrid}>
                <View style={styles.weatherItem}>
                  <Icon name="water" size={20} color={COLORS.info} />
                  <Text style={styles.weatherLabel}>Humidity</Text>
                  <Text style={styles.weatherValue}>65%</Text>
                </View>
                <View style={styles.weatherItem}>
                  <Icon name="weather-windy" size={20} color={COLORS.secondary} />
                  <Text style={styles.weatherLabel}>Wind</Text>
                  <Text style={styles.weatherValue}>12 mph</Text>
                </View>
                <View style={styles.weatherItem}>
                  <Icon name="weather-rainy" size={20} color={COLORS.primary} />
                  <Text style={styles.weatherLabel}>Precipitation</Text>
                  <Text style={styles.weatherValue}>0.1 in</Text>
                </View>
                <View style={styles.weatherItem}>
                  <Icon name="gauge" size={20} color={COLORS.accent} />
                  <Text style={styles.weatherLabel}>Pressure</Text>
                  <Text style={styles.weatherValue}>1013 hPa</Text>
                </View>
              </View>
            </View>

            <View style={styles.apiInfo}>
              <Text style={styles.apiInfoTitle}>API Integration Required</Text>
              <Text style={styles.apiInfoText}>
                To get real weather data, integrate with:
                {'\n'}• Open-Meteo API
                {'\n'}• Weather.gov API
                {'\n'}• Or any weather service provider
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Weather Data</Text>
        {/* Weather content will be added here */}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textLight,
  },
  errorContainer: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  errorTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  errorMessage: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  mockSection: {
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  mockNote: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLighter,
    fontStyle: 'italic',
    marginBottom: SPACING.lg,
  },
  weatherCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  locationText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textLight,
    marginLeft: SPACING.sm,
  },
  temperatureContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  temperature: {
    fontSize: TYPOGRAPHY.fontSize['4xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
  },
  condition: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  weatherGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  weatherItem: {
    width: '48%',
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  weatherLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  weatherValue: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
  },
  apiInfo: {
    backgroundColor: `${COLORS.info}15`,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
  },
  apiInfoTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.info,
    marginBottom: SPACING.sm,
  },
  apiInfoText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
});

export default WeatherScreen;