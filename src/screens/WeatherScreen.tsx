/**
 * Weather Screen
 * Displays weather information and forecasts
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

// Mock weather data
const MOCK_WEATHER_DATA = {
  current: {
    temperature: 72,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    precipitation: 0.1,
    feelsLike: 74,
  },
  forecast: [
    { day: 'Today', high: 75, low: 62, condition: 'Partly Cloudy', precipitation: 10 },
    { day: 'Tomorrow', high: 78, low: 64, condition: 'Sunny', precipitation: 0 },
    { day: 'Wed', high: 80, low: 66, condition: 'Mostly Sunny', precipitation: 5 },
    { day: 'Thu', high: 76, low: 63, condition: 'Rain', precipitation: 80 },
    { day: 'Fri', high: 74, low: 61, condition: 'Cloudy', precipitation: 30 },
  ],
  alerts: [
    { type: 'warning', message: 'Thunderstorm warning in effect until 8 PM' },
    { type: 'info', message: 'High pollen count today' },
  ],
};

interface WeatherScreenProps {
  onBack: () => void;
}

const WeatherScreen: React.FC<WeatherScreenProps> = ({ onBack }) => {
  const [weatherData, setWeatherData] = useState(MOCK_WEATHER_DATA);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchWeatherData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setWeatherData(MOCK_WEATHER_DATA);
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchWeatherData();
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const getConditionIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'mostly sunny':
        return '☀️';
      case 'partly cloudy':
      case 'cloudy':
        return '⛅';
      case 'rain':
        return '🌧️';
      case 'thunderstorm':
        return '⛈️';
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
          </View>
        ) : (
          <>
            {/* Current Weather Card */}
            <View style={styles.currentWeatherCard}>
              <Text style={styles.sectionTitle}>Current Weather</Text>
              <View style={styles.currentWeatherContent}>
                <View style={styles.temperatureContainer}>
                  <Text style={styles.temperature}>
                    {weatherData.current.temperature}°
                  </Text>
                  <Text style={styles.condition}>
                    {weatherData.current.condition}
                  </Text>
                </View>
                <View style={styles.weatherDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Feels Like:</Text>
                    <Text style={styles.detailValue}>
                      {weatherData.current.feelsLike}°
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Humidity:</Text>
                    <Text style={styles.detailValue}>
                      {weatherData.current.humidity}%
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Wind:</Text>
                    <Text style={styles.detailValue}>
                      {weatherData.current.windSpeed} mph
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Precipitation:</Text>
                    <Text style={styles.detailValue}>
                      {weatherData.current.precipitation} in
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
                    <Text style={styles.forecastDayName}>{day.day}</Text>
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
                        {day.precipitation}%
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Weather Tips */}
            <View style={styles.tipsContainer}>
              <Text style={styles.sectionTitle}>Weather Tips</Text>
              <View style={styles.tipCard}>
                <Text style={styles.tipText}>
                  • Stay hydrated in warm weather
                </Text>
                <Text style={styles.tipText}>
                  • Check for weather alerts before outdoor activities
                </Text>
                <Text style={styles.tipText}>
                  • Have an emergency kit ready during storm season
                </Text>
              </View>
            </View>
          </>
        )}
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
    fontSize: 16,
    color: COLORS.textLight,
  },
  currentWeatherCard: {
    backgroundColor: COLORS.surface,
    margin: 16,
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
  tipsContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  tipCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
  },
});

export default WeatherScreen;