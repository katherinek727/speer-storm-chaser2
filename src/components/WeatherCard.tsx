/**
 * Reusable Weather Card Component
 * Displays weather information in a consistent card format
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';

interface WeatherCardProps {
  title: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  pressure: number;
  location?: string;
  timestamp?: string;
  showDetails?: boolean;
  onPress?: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  title,
  temperature,
  condition,
  humidity,
  windSpeed,
  precipitation,
  pressure,
  location,
  timestamp,
  showDetails = true,
  onPress,
}) => {
  return (
    <View style={[styles.card, SHADOWS.md]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {location && <Text style={styles.location}>{location}</Text>}
        </View>
        {timestamp && <Text style={styles.timestamp}>{timestamp}</Text>}
      </View>

      {/* Main Weather Info */}
      <View style={styles.mainInfo}>
        <View style={styles.temperatureContainer}>
          <Text style={styles.temperature}>{temperature}°</Text>
          <Text style={styles.condition}>{condition}</Text>
        </View>
        <View style={styles.weatherIcon}>
          <Icon
            name={
              condition.toLowerCase().includes('rain')
                ? 'weather-rainy'
                : condition.toLowerCase().includes('cloud')
                ? 'weather-cloudy'
                : condition.toLowerCase().includes('sun')
                ? 'weather-sunny'
                : condition.toLowerCase().includes('snow')
                ? 'weather-snowy'
                : condition.toLowerCase().includes('storm')
                ? 'weather-lightning'
                : 'weather-partly-cloudy'
            }
            size={48}
            color={COLORS.primary}
          />
        </View>
      </View>

      {/* Weather Details */}
      {showDetails && (
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Icon name="water" size={20} color={COLORS.info} />
            <Text style={styles.detailLabel}>Humidity</Text>
            <Text style={styles.detailValue}>{humidity}%</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="weather-windy" size={20} color={COLORS.secondary} />
            <Text style={styles.detailLabel}>Wind</Text>
            <Text style={styles.detailValue}>{windSpeed} mph</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="weather-rainy" size={20} color={COLORS.primary} />
            <Text style={styles.detailLabel}>Precip</Text>
            <Text style={styles.detailValue}>{precipitation} in</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="gauge" size={20} color={COLORS.accent} />
            <Text style={styles.detailLabel}>Pressure</Text>
            <Text style={styles.detailValue}>{pressure} hPa</Text>
          </View>
        </View>
      )}

      {/* Footer */}
      {onPress && (
        <View style={styles.footer}>
          <Text style={styles.viewDetails} onPress={onPress}>
            View Full Details →
          </Text>
        </View>
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  location: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
  },
  timestamp: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textLighter,
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  temperatureContainer: {
    flex: 1,
  },
  temperature: {
    fontSize: TYPOGRAPHY.fontSize['4xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  condition: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textLight,
  },
  weatherIcon: {
    marginLeft: SPACING.md,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  detailItem: {
    width: '48%',
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
    marginTop: SPACING.sm,
    alignItems: 'flex-end',
  },
  viewDetails: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
});

export default WeatherCard;