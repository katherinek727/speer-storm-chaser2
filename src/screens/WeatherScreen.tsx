/**
 * Weather Screen - Displays current weather data
 */

import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../src/types/navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import WeatherCard from '../components/WeatherCard';
import WeatherDetailCard from '../components/WeatherDetailCard';
import ForecastCard from '../components/ForecastCard';
import { getCurrentWeather, getWeatherForecast, searchLocations } from '../services/weatherService';
import { WeatherData, WeatherForecast as ForecastType, WeatherLocation } from '../types';

type WeatherScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Weather'>;

interface Props {
  navigation: WeatherScreenNavigationProp;
}

const WeatherScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [expandedDetails, setExpandedDetails] = React.useState(false);
  const [weatherData, setWeatherData] = React.useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = React.useState<ForecastType | null>(null);
  const [currentLocation, setCurrentLocation] = React.useState<WeatherLocation>({
    latitude: 40.7128, // New York default
    longitude: -74.0060,
    name: 'New York, NY',
  });
  const [locationSearchResults, setLocationSearchResults] = React.useState<WeatherLocation[]>([]);
  const [showLocationSearch, setShowLocationSearch] = React.useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = React.useState('');
  const [apiError, setApiError] = React.useState<string | null>(null);

  // Default weather details (will be populated with real data)
  const [weatherDetails, setWeatherDetails] = React.useState([
    { label: 'Feels Like', value: '--', icon: 'thermometer', color: COLORS.error, unit: '°F' },
    { label: 'Visibility', value: '--', icon: 'eye', color: COLORS.info, unit: 'mi' },
    { label: 'UV Index', value: '--', icon: 'weather-sunny', color: COLORS.warning, unit: 'of 11' },
    { label: 'Dew Point', value: '--', icon: 'water', color: COLORS.primary, unit: '°F' },
    { label: 'Wind Gust', value: '--', icon: 'weather-windy', color: COLORS.secondary, unit: 'mph' },
    { label: 'Cloud Cover', value: '--', icon: 'cloud', color: COLORS.textLight, unit: '%' },
    { label: 'Sunrise', value: '--:--', icon: 'weather-sunset-up', color: COLORS.warning, unit: 'AM' },
    { label: 'Sunset', value: '--:--', icon: 'weather-sunset-down', color: COLORS.accent, unit: 'PM' },
  ]);

  const loadWeatherData = async (latitude: number, longitude: number) => {
    try {
      setApiError(null);
      
      // Load current weather
      const currentResponse = await getCurrentWeather(latitude, longitude);
      
      if (currentResponse.success && currentResponse.data) {
        setWeatherData(currentResponse.data);
        
        // Update weather details with real data
        setWeatherDetails([
          { label: 'Feels Like', value: `${Math.round(currentResponse.data.feelsLike)}`, icon: 'thermometer', color: COLORS.error, unit: '°F' },
          { label: 'Visibility', value: `${currentResponse.data.visibility}`, icon: 'eye', color: COLORS.info, unit: 'mi' },
          { label: 'UV Index', value: '--', icon: 'weather-sunny', color: COLORS.warning, unit: 'of 11' }, // Not in basic API
          { label: 'Dew Point', value: '--', icon: 'water', color: COLORS.primary, unit: '°F' }, // Would need calculation
          { label: 'Wind Gust', value: `${Math.round(currentResponse.data.windSpeed * 1.2)}`, icon: 'weather-windy', color: COLORS.secondary, unit: 'mph' },
          { label: 'Cloud Cover', value: `${currentResponse.data.cloudCover}`, icon: 'cloud', color: COLORS.textLight, unit: '%' },
          { label: 'Sunrise', value: '6:15', icon: 'weather-sunset-up', color: COLORS.warning, unit: 'AM' }, // Would need forecast API
          { label: 'Sunset', value: '8:30', icon: 'weather-sunset-down', color: COLORS.accent, unit: 'PM' }, // Would need forecast API
        ]);
      } else {
        setApiError(currentResponse.message || 'Failed to load weather data');
      }

      // Load forecast
      const forecastResponse = await getWeatherForecast(latitude, longitude, 5);
      if (forecastResponse.success) {
        setForecastData(forecastResponse.data);
      }

    } catch (error: any) {
      console.error('Error loading weather data:', error);
      setApiError(error.message || 'Network error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadWeatherData(currentLocation.latitude, currentLocation.longitude);
  }, [currentLocation]);

  const handleLocationSearch = async (query: string) => {
    setLocationSearchQuery(query);
    
    if (query.trim().length < 2) {
      setLocationSearchResults([]);
      return;
    }

    try {
      const response = await searchLocations(query, 5);
      if (response.success) {
        setLocationSearchResults(response.data);
      }
    } catch (error) {
      console.error('Location search error:', error);
    }
  };

  const handleSelectLocation = (location: WeatherLocation) => {
    setCurrentLocation(location);
    setShowLocationSearch(false);
    setLocationSearchQuery('');
    setLocationSearchResults([]);
    setLoading(true);
    loadWeatherData(location.latitude, location.longitude);
  };

  const handleUseCurrentLocation = () => {
    // In a real app, this would use device GPS
    Alert.alert(
      'GPS Integration',
      'In a real implementation, this would use the device GPS to get current location.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Use Demo Location',
          onPress: () => {
            const demoLocation: WeatherLocation = {
              latitude: 37.7749, // San Francisco
              longitude: -122.4194,
              name: 'San Francisco, CA',
            };
            handleSelectLocation(demoLocation);
          },
        },
      ],
    );
  };

  // Helper function to get forecast icon based on condition
  const getForecastIcon = (condition: string): string => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
      return 'weather-sunny';
    } else if (conditionLower.includes('cloud')) {
      return 'weather-cloudy';
    } else if (conditionLower.includes('rain')) {
      return 'weather-rainy';
    } else if (conditionLower.includes('snow')) {
      return 'weather-snowy';
    } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
      return 'weather-lightning';
    } else if (conditionLower.includes('fog')) {
      return 'weather-fog';
    } else if (conditionLower.includes('wind')) {
      return 'weather-windy';
    } else if (conditionLower.includes('hail')) {
      return 'weather-hail';
    }
    return 'weather-partly-cloudy';
  };

  React.useEffect(() => {
    // Initial data load
    loadWeatherData(currentLocation.latitude, currentLocation.longitude);
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
              {weatherData 
                ? `Last updated: ${new Date(weatherData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : 'Loading...'}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={() => setShowLocationSearch(!showLocationSearch)}>
            <Icon name="map-marker" size={20} color={COLORS.primary} />
            <Text style={styles.locationButtonText} numberOfLines={1}>
              {currentLocation.name || `${currentLocation.latitude.toFixed(2)}°, ${currentLocation.longitude.toFixed(2)}°`}
            </Text>
            <Icon name={showLocationSearch ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>

        {/* Location Search */}
        {showLocationSearch && (
          <View style={styles.locationSearchContainer}>
            <View style={styles.searchInputContainer}>
              <Icon name="magnify" size={20} color={COLORS.textLight} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for a city..."
                value={locationSearchQuery}
                onChangeText={handleLocationSearch}
                placeholderTextColor={COLORS.textLighter}
              />
              {locationSearchQuery ? (
                <TouchableOpacity onPress={() => setLocationSearchQuery('')}>
                  <Icon name="close" size={18} color={COLORS.textLight} />
                </TouchableOpacity>
              ) : null}
            </View>
            
            {locationSearchResults.length > 0 ? (
              <View style={styles.searchResults}>
                {locationSearchResults.map((location, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.searchResultItem}
                    onPress={() => handleSelectLocation(location)}>
                    <Icon name="map-marker" size={16} color={COLORS.primary} />
                    <View style={styles.searchResultText}>
                      <Text style={styles.searchResultName}>{location.name}</Text>
                      <Text style={styles.searchResultDetails}>
                        {[location.admin1, location.country].filter(Boolean).join(', ')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : locationSearchQuery.length >= 2 ? (
              <Text style={styles.noResultsText}>No locations found</Text>
            ) : null}
            
            <TouchableOpacity
              style={styles.currentLocationButton}
              onPress={handleUseCurrentLocation}>
              <Icon name="crosshairs-gps" size={18} color={COLORS.primary} />
              <Text style={styles.currentLocationText}>Use Current Location</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* API Error */}
        {apiError && (
          <View style={styles.errorCard}>
            <Icon name="alert-circle" size={24} color={COLORS.error} />
            <View style={styles.errorContent}>
              <Text style={styles.errorTitle}>API Error</Text>
              <Text style={styles.errorMessage}>{apiError}</Text>
              <Text style={styles.errorHint}>
                Using mock data. Check internet connection or try another location.
              </Text>
            </View>
          </View>
        )}

        {/* Current Weather Card */}
        {weatherData ? (
          <WeatherCard
            title="Current Conditions"
            temperature={Math.round(weatherData.temperature)}
            condition={weatherData.condition}
            humidity={weatherData.humidity}
            windSpeed={Math.round(weatherData.windSpeed)}
            precipitation={weatherData.precipitation}
            pressure={weatherData.pressure}
            location={currentLocation.name || 'Current Location'}
            timestamp={new Date(weatherData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          />
        ) : (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loadingCardText}>Loading weather data...</Text>
          </View>
        )}

        {/* Weather Details */}
        <WeatherDetailCard
          title="Weather Details"
          details={weatherDetails}
          expanded={expandedDetails}
          onToggle={() => setExpandedDetails(!expandedDetails)}
        />

        {/* Forecast */}
        {forecastData ? (
          <ForecastCard
            title="5-Day Forecast"
            forecast={forecastData.daily.map((day, index) => ({
              day: index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
              date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              high: Math.round(day.high),
              low: Math.round(day.low),
              condition: day.condition,
              precipitation: day.precipitationChance,
              icon: getForecastIcon(day.condition),
            }))}
            unit="F"
          />
        ) : (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loadingCardText}>Loading forecast...</Text>
          </View>
        )}

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
    maxWidth: 200,
  },
  locationSearchContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.border}20`,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
  },
  searchInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    marginRight: SPACING.sm,
  },
  searchResults: {
    marginBottom: SPACING.md,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: `${COLORS.border}50`,
  },
  searchResultText: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  searchResultName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  searchResultDetails: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
  },
  noResultsText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingVertical: SPACING.md,
    fontStyle: 'italic',
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  currentLocationText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginLeft: SPACING.sm,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.error}10`,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  errorContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  errorTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.error,
    marginBottom: SPACING.xs,
  },
  errorMessage: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  errorHint: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  loadingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  loadingCardText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
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