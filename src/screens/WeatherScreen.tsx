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
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../src/types/navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import WeatherCard from '../components/WeatherCard';
import WeatherDetailCard from '../components/WeatherDetailCard';
import ForecastCard from '../components/ForecastCard';

type WeatherScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Weather'>;

interface Props {
  navigation: WeatherScreenNavigationProp;
}

const WeatherScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [expandedDetails, setExpandedDetails] = React.useState(false);
  const [weatherData, setWeatherData] = React.useState({
    current: {
      temperature: 72,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
      precipitation: 0.1,
      pressure: 1013,
      feelsLike: 75,
      visibility: 10,
      uvIndex: 5,
      dewPoint: 60,
    },
    location: 'New York, NY',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  const forecastData = [
    { day: 'Today', date: 'May 22', high: 72, low: 60, condition: 'Partly Cloudy', precipitation: 10, icon: 'weather-partly-cloudy' },
    { day: 'Thu', date: 'May 23', high: 75, low: 62, condition: 'Sunny', precipitation: 0, icon: 'weather-sunny' },
    { day: 'Fri', date: 'May 24', high: 68, low: 58, condition: 'Rain', precipitation: 80, icon: 'weather-rainy' },
    { day: 'Sat', date: 'May 25', high: 70, low: 59, condition: 'Cloudy', precipitation: 20, icon: 'weather-cloudy' },
    { day: 'Sun', date: 'May 26', high: 73, low: 61, condition: 'Partly Cloudy', precipitation: 10, icon: 'weather-partly-cloudy' },
    { day: 'Mon', date: 'May 27', high: 76, low: 63, condition: 'Sunny', precipitation: 0, icon: 'weather-sunny' },
  ];

  const weatherDetails = [
    { label: 'Feels Like', value: `${weatherData.current.feelsLike}`, icon: 'thermometer', color: COLORS.error, unit: '°F' },
    { label: 'Visibility', value: `${weatherData.current.visibility}`, icon: 'eye', color: COLORS.info, unit: 'mi' },
    { label: 'UV Index', value: `${weatherData.current.uvIndex}`, icon: 'weather-sunny', color: COLORS.warning, unit: 'of 11' },
    { label: 'Dew Point', value: `${weatherData.current.dewPoint}`, icon: 'water', color: COLORS.primary, unit: '°F' },
    { label: 'Wind Gust', value: '15', icon: 'weather-windy', color: COLORS.secondary, unit: 'mph' },
    { label: 'Cloud Cover', value: '40', icon: 'cloud', color: COLORS.textLight, unit: '%' },
    { label: 'Sunrise', value: '6:15', icon: 'weather-sunset-up', color: COLORS.warning, unit: 'AM' },
    { label: 'Sunset', value: '8:30', icon: 'weather-sunset-down', color: COLORS.accent, unit: 'PM' },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      setWeatherData({
        ...weatherData,
        current: {
          ...weatherData.current,
          temperature: Math.floor(Math.random() * 20) + 65,
          windSpeed: Math.floor(Math.random() * 10) + 8,
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      setRefreshing(false);
    }, 1500);
  }, [weatherData]);

  React.useEffect(() => {
    // Initial data load
    const timer = setTimeout(() => {
      setLoading(false);
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Weather Data</Text>
            <Text style={styles.subtitle}>
              Last updated: {weatherData.timestamp}
            </Text>
          </View>
          <TouchableOpacity style={styles.locationButton}>
            <Icon name="map-marker" size={20} color={COLORS.primary} />
            <Text style={styles.locationButtonText}>{weatherData.location}</Text>
            <Icon name="chevron-down" size={16} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>

        {/* Current Weather Card */}
        <WeatherCard
          title="Current Conditions"
          temperature={weatherData.current.temperature}
          condition={weatherData.current.condition}
          humidity={weatherData.current.humidity}
          windSpeed={weatherData.current.windSpeed}
          precipitation={weatherData.current.precipitation}
          pressure={weatherData.current.pressure}
          location={weatherData.location}
          timestamp={weatherData.timestamp}
        />

        {/* Weather Details */}
        <WeatherDetailCard
          title="Weather Details"
          details={weatherDetails}
          expanded={expandedDetails}
          onToggle={() => setExpandedDetails(!expandedDetails)}
        />

        {/* Forecast */}
        <ForecastCard
          title="5-Day Forecast"
          forecast={forecastData}
          unit="F"
        />

        {/* Weather Alerts */}
        <View style={[styles.alertCard, SHADOWS.md]}>
          <View style={styles.alertHeader}>
            <Icon name="alert" size={24} color={COLORS.warning} />
            <Text style={styles.alertTitle}>Weather Alerts</Text>
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertMessage}>
              No active weather alerts for your location.
            </Text>
            <Text style={styles.alertSubtext}>
              Severe weather alerts will appear here when issued.
            </Text>
          </View>
        </View>

        {/* API Integration Info */}
        <View style={styles.apiInfo}>
          <Text style={styles.apiInfoTitle}>API Integration Ready</Text>
          <Text style={styles.apiInfoText}>
            This screen is ready for real weather API integration. Connect to:
            {'\n'}• Open-Meteo API (free, no key required)
            {'\n'}• Weather.gov API (free, US only)
            {'\n'}• Any weather service provider
          </Text>
          <View style={styles.apiFeatures}>
            <View style={styles.apiFeature}>
              <Icon name="api" size={16} color={COLORS.success} />
              <Text style={styles.apiFeatureText}>REST API Support</Text>
            </View>
            <View style={styles.apiFeature}>
              <Icon name="map-marker" size={16} color={COLORS.primary} />
              <Text style={styles.apiFeatureText}>GPS Location</Text>
            </View>
            <View style={styles.apiFeature}>
              <Icon name="refresh" size={16} color={COLORS.accent} />
              <Text style={styles.apiFeatureText}>Auto Refresh</Text>
            </View>
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
  header: {
    marginBottom: SPACING.xl,
  },
  headerContent: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignSelf: 'flex-start',
  },
  locationButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginHorizontal: SPACING.sm,
  },
  alertCard: {
    backgroundColor: `${COLORS.warning}10`,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  alertTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.warning,
    marginLeft: SPACING.sm,
  },
  alertContent: {
    marginLeft: SPACING.xl,
  },
  alertMessage: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginBottom: SPACING.xs,
  },
  alertSubtext: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
  },
  apiInfo: {
    backgroundColor: `${COLORS.info}10`,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
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
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  apiFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  apiFeature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  apiFeatureText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
  },
});

export default WeatherScreen;