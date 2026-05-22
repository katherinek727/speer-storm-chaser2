/**
 * Forecast Card Component
 * Displays weather forecast for multiple days
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';

interface ForecastDay {
  day: string;
  date: string;
  high: number;
  low: number;
  condition: string;
  precipitation: number;
  icon: string;
}

interface ForecastCardProps {
  title: string;
  forecast: ForecastDay[];
  unit?: 'C' | 'F';
}

const ForecastCard: React.FC<ForecastCardProps> = ({
  title,
  forecast,
  unit = 'F',
}) => {
  const getConditionIcon = (condition: string): string => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sun') || conditionLower.includes('clear')) {
      return 'weather-sunny';
    } else if (conditionLower.includes('cloud')) {
      return 'weather-cloudy';
    } else if (conditionLower.includes('rain')) {
      return 'weather-rainy';
    } else if (conditionLower.includes('snow')) {
      return 'weather-snowy';
    } else if (conditionLower.includes('storm')) {
      return 'weather-lightning';
    } else if (conditionLower.includes('fog')) {
      return 'weather-fog';
    } else if (conditionLower.includes('wind')) {
      return 'weather-windy';
    }
    return 'weather-partly-cloudy';
  };

  const getConditionColor = (condition: string): string => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sun') || conditionLower.includes('clear')) {
      return COLORS.warning;
    } else if (conditionLower.includes('cloud')) {
      return COLORS.textLight;
    } else if (conditionLower.includes('rain')) {
      return COLORS.info;
    } else if (conditionLower.includes('snow')) {
      return COLORS.primary;
    } else if (conditionLower.includes('storm')) {
      return COLORS.accent;
    }
    return COLORS.textLight;
  };

  return (
    <View style={[styles.card, SHADOWS.md]}>
      <Text style={styles.title}>{title}</Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {forecast.map((day, index) => (
          <View key={index} style={styles.forecastDay}>
            <Text style={styles.dayText}>{day.day}</Text>
            <Text style={styles.dateText}>{day.date}</Text>
            
            <View style={styles.temperatureContainer}>
              <Text style={styles.highTemp}>{day.high}°</Text>
              <Text style={styles.lowTemp}>{day.low}°</Text>
            </View>

            <View style={styles.conditionContainer}>
              <Icon
                name={getConditionIcon(day.condition)}
                size={32}
                color={getConditionColor(day.condition)}
              />
              <Text style={styles.conditionText} numberOfLines={1}>
                {day.condition}
              </Text>
            </View>

            {day.precipitation > 0 && (
              <View style={styles.precipitationContainer}>
                <Icon name="water" size={14} color={COLORS.info} />
                <Text style={styles.precipitationText}>
                  {day.precipitation}%
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {unit === 'F' ? 'Temperatures in Fahrenheit' : 'Temperatures in Celsius'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  scrollContent: {
    paddingRight: SPACING.lg,
  },
  forecastDay: {
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: `${COLORS.primary}05`,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.md,
    minWidth: 100,
  },
  dayText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: 2,
  },
  dateText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  highTemp: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginRight: SPACING.xs,
  },
  lowTemp: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textLight,
  },
  conditionContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  conditionText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 2,
    maxWidth: 80,
  },
  precipitationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.info}15`,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  precipitationText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.info,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginLeft: 2,
  },
  footer: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ForecastCard;