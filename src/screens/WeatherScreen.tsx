/**
 * Weather Screen with Real API and Location Tracking
 * Displays real weather information from Open-Meteo API
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';

// Simple colors matching the main app
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

// Types for weather data
interface CurrentWeather {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  feelsLike: number;
  time: string;
}

interface ForecastDay {
  day: string;
  date: string;
  high: number;
  low: number;
  condition: string;
  precipitation: number;
}

interface WeatherData {
  current: CurrentWeather;
  forecast: ForecastDay[];
  alerts: Array<{ type: string; message: string }>;
  location: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };
}

interface WeatherScreenProps {
  onBack: () => void;
}

const WeatherScreen: React.FC<WeatherScreenProps> = ({ onBack }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Request location permission
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to show weather data.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Location permission error:', err);
        return false;
      }
    }
    return true; // iOS는 다른 방식으로 처리
  };

  // Get current location using Web Geolocation API
  const getCurrentLocation = () => {
    return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
      // TypeScript workaround for navigator.geolocation
      const geo = (navigator as any).geolocation;
      if (!geo) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      geo.getCurrentPosition(
        (position: any) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error: any) => {
          console.error('Location error:', error);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };

  // Fetch weather data from Open-Meteo API
  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      // Current weather
      const currentResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,wind_speed_10m,wind_direction_10m&timezone=auto`
      );
      
      // Forecast
      const forecastResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=5`
      );

      if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();

      // Get city name from reverse geocoding (using a simple service)
      let cityName = 'Unknown Location';
      try {
        const geoResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          cityName = geoData.address?.city || geoData.address?.town || geoData.address?.village || 'Unknown Location';
        }
      } catch (geoError) {
        console.error('Geocoding error:', geoError);
      }

      // Map weather code to condition
      const getConditionFromCode = (code: number): string => {
        if (code === 0) return 'Clear Sky';
        if (code <= 3) return 'Partly Cloudy';
        if (code <= 48) return 'Fog';
        if (code <= 55) return 'Drizzle';
        if (code <= 65) return 'Rain';
        if (code <= 77) return 'Snow';
        if (code <= 99) return 'Thunderstorm';
        return 'Unknown';
      };

      // Process current weather
      const current: CurrentWeather = {
        temperature: Math.round(currentData.current.temperature_2m),
        condition: getConditionFromCode(currentData.current.weather_code),
        humidity: currentData.current.relative_humidity_2m,
        windSpeed: Math.round(currentData.current.wind_speed_10m),
        precipitation: currentData.current.precipitation,
        feelsLike: Math.round(currentData.current.apparent_temperature),
        time: new Date(currentData.current.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Process forecast
      const forecast: ForecastDay[] = forecastData.daily.time.map((date: string, index: number) => {
        const dayDate = new Date(date);
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return {
          day: index === 0 ? 'Today' : dayNames[dayDate.getDay()],
          date: dayDate.toLocaleDateString([], { month: 'short', day: 'numeric' }),
          high: Math.round(forecastData.daily.temperature_2m_max[index]),
          low: Math.round(forecastData.daily.temperature_2m_min[index]),
          condition: getConditionFromCode(forecastData.daily.weather_code[index]),
          precipitation: Math.round(forecastData.daily.precipitation_sum[index] * 10) / 10,
        };
      });

      // Generate alerts based on conditions
      const alerts: Array<{ type: string; message: string }> = [];
      if (current.precipitation > 5) {
        alerts.push({ type: 'warning', message: 'Heavy precipitation expected' });
      }
      if (current.windSpeed > 20) {
        alerts.push({ type: 'warning', message: 'Strong winds detected' });
      }
      if (current.temperature > 35) {
        alerts.push({ type: 'warning', message: 'High temperature warning' });
      }
      if (current.temperature < 0) {
        alerts.push({ type: 'warning', message: 'Freezing temperatures' });
      }

      const weatherData: WeatherData = {
        current,
        forecast,
        alerts,
        location: {
          latitude: lat,
          longitude: lon,
          city: cityName,
        },
      };

      setWeatherData(weatherData);
      setError(null);
    } catch (err) {
      console.error('Weather API error:', err);
      setError('Failed to load weather data. Please check your connection and try again.');
      // Fallback to mock data for demonstration
      setWeatherData(getMockWeatherData(lat, lon));
    }
  };

  // Mock data for fallback
  const getMockWeatherData = (lat: number, lon: number): WeatherData => {
    return {
      current: {
        temperature: 72,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 12,
        precipitation: 0.1,
        feelsLike: 74,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      forecast: [
        { day: 'Today', date: 'Now', high: 75, low: 62, condition: 'Partly Cloudy', precipitation: 10 },
        { day: 'Tomorrow', date: 'Tomorrow', high: 78, low: 64, condition: 'Sunny', precipitation: 0 },
        { day: 'Wed', date: 'May 25', high: 80, low: 66, condition: 'Mostly Sunny', precipitation: 5 },
        { day: 'Thu', date: 'May 26', high: 76, low: 63, condition: 'Rain', precipitation: 80 },
        { day: 'Fri', date: 'May 27', high: 74, low: 61, condition: 'Cloudy', precipitation: 30 },
      ],
      alerts: [
        { type: 'info', message: 'Using demonstration data (API unavailable)' },
      ],
      location: {
        latitude: lat,
        longitude: lon,
        city: 'Demo Location',
      },
    };
  };

  // Load weather data
  const loadWeatherData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Request location permission
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setError('Location permission is required to show weather data.');
        setLoading(false);
        return;
      }

      // Get current location
      const location = await getCurrentLocation();
      setLocation(location);

      // Fetch weather data
      await fetchWeatherData(location.latitude, location.longitude);
    } catch (err) {
      console.error('Load weather error:', err);
      setError('Failed to get location. Please enable location services.');
      
      // Fallback to default location (Seoul)
      const defaultLocation = { latitude: 37.5665, longitude: 126.9780 };
      setLocation(defaultLocation);
      await fetchWeatherData(defaultLocation.latitude, defaultLocation.longitude);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadWeatherData();
  };

  useEffect(() => {
    loadWeatherData();
  }, []);

  const getConditionIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear sky':
      case 'sunny':
      case 'mostly sunny':
        return '☀️';
      case 'partly cloudy':
        return '⛅';
      case 'cloudy':
        return '☁️';
      case 'rain':
      case 'drizzle':
        return '🌧️';
      case 'thunderstorm':
        return '⛈️';
      case 'snow':
        return '❄️';
      case 'fog':
        return '🌫️';
      default:
        return '🌤️';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return COLORS.warning;
      case 'error': return COLORS.error;
      case 'info': return COLORS.info;
      default: return COLORS.info;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Weather Data</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading weather data...</Text>
            <Text style={styles.loadingSubtext}>Fetching your location and weather information</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Unable to Load Data</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadWeatherData}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : weatherData ? (
          <>
            {/* Location Info */}
            <View style={styles.locationCard}>
              <Text style={styles.locationIcon}>📍</Text>
              <View style={styles.locationInfo}>
                <Text style={styles.locationTitle}>{weatherData.location.city}</Text>
                <Text style={styles.locationCoords}>
                  {weatherData.location.latitude.toFixed(4)}°N, {weatherData.location.longitude.toFixed(4)}°E
                </Text>
                <Text style={styles.locationTime}>
                  Last updated: {weatherData.current.time}
                </Text>
              </View>
            </View>

            {/* Current Weather Card */}
            <View style={styles.currentWeatherCard}>
              <Text style={styles.sectionTitle}>Current Weather</Text>
              <View style={styles.currentWeatherContent}>
                <View style={styles.temperatureContainer}>
                  <Text style={styles.temperature}>
                    {weatherData.current.temperature}°
                  </Text>
                  <Text style={styles.condition}>
                    {getConditionIcon(weatherData.current.condition)} {weatherData.current.condition}
                  </Text>
                  <Text style={styles.feelsLike}>
                    Feels like {weatherData.current.feelsLike}°
                  </Text>
                </View>
                <View style={styles.weatherDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Humidity:</Text>
                    <Text style={styles.detailValue}>
                      {weatherData.current.humidity}%
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Wind:</Text>
                    <Text style={styles.detailValue}>
                      {weatherData.current.windSpeed} km/h
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Precipitation:</Text>
                    <Text style={styles.detailValue}>
                      {weatherData.current.precipitation} mm
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Data Source:</Text>
                    <Text style={styles.detailValue}>
                      Open-Meteo API
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Weather Alerts */}
            {weatherData.alerts.length > 0 && (
              <View style={styles.alertsContainer}>
                <Text style={styles.sectionTitle}>Weather Alerts</Text>
                {weatherData.alerts.map((alert, index) => (
                  <View
                    key={index}
                    style={[
                      styles.alertCard,
                      { backgroundColor: getAlertColor(alert.type) + '20' },
                    ]}
                  >
                    <View
                      style={[
                        styles.alertIndicator,
                        { backgroundColor: getAlertColor(alert.type) },
                      ]}
                    />
                    <Text style={styles.alertText}>{alert.message}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* 5-Day Forecast */}
            <View style={styles.forecastContainer}>
              <Text style={styles.sectionTitle}>5-Day Forecast</Text>
              {weatherData.forecast.map((day, index) => (
                <View key={index} style={styles.forecastDay}>
                  <View style={styles.forecastDayHeader}>
                    <View>
                      <Text style={styles.forecastDayName}>{day.day}</Text>
                      <Text style={styles.forecastDate}>{day.date}</Text>
                    </View>
                    <Text style={styles.forecastCondition}>
                      {getConditionIcon(day.condition)} {day.condition}
                    </Text>
                  </View>
                  <View style={styles.forecastDetails}>
                    <View style={styles.tempRange}>
                      <Text style={styles.tempHigh}>H: {day.high}°</Text>
                      <Text style={styles.tempLow}>L: {day.low}°</Text>
                    </View>
                    <View style={styles.precipitationContainer}>
                      <Text style={styles.precipitationLabel}>Precip:</Text>
                      <Text style={styles.precipitationValue}>
                        {day.precipitation} mm
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* API Info */}
            <View style={styles.apiInfoContainer}>
              <Text style={styles.apiInfoText}>
                Weather data provided by Open-Meteo API
              </Text>
              <Text style={styles.apiInfoSubtext}>
                Real-time weather information from global meteorological sources
              </Text>
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.error,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  locationCard: {
    backgroundColor: COLORS.surface,
    margin: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  locationCoords: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  locationTime: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  currentWeatherCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  currentWeatherContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  temperatureContainer: {
    alignItems: 'center',
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  condition: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 4,
  },
  feelsLike: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  weatherDetails: {
    flex: 1,
    marginLeft: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  alertsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning + '20',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  alertIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  forecastContainer: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  forecastDay: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
    paddingVertical: 12,
  },
  forecastDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forecastDayName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  forecastDate: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  forecastCondition: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  forecastDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tempRange: {
    flexDirection: 'row',
    gap: 16,
  },
  tempHigh: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  tempLow: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  precipitationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  precipitationLabel: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  precipitationValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  apiInfoContainer: {
    backgroundColor: COLORS.primary + '10',
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  apiInfoText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  apiInfoSubtext: {
    fontSize: 10,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

export default WeatherScreen;