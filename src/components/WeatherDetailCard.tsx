/**
 * Weather Detail Card Component
 * Displays detailed weather information in an expandable card
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';

interface WeatherDetail {
  label: string;
  value: string;
  icon: string;
  color: string;
  unit?: string;
}

interface WeatherDetailCardProps {
  title: string;
  details: WeatherDetail[];
  expanded?: boolean;
  onToggle?: () => void;
  showToggle?: boolean;
}

const WeatherDetailCard: React.FC<WeatherDetailCardProps> = ({
  title,
  details,
  expanded = false,
  onToggle,
  showToggle = true,
}) => {
  const visibleDetails = expanded ? details : details.slice(0, 4);

  return (
    <View style={[styles.card, SHADOWS.md]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {showToggle && onToggle && (
          <TouchableOpacity onPress={onToggle} style={styles.toggleButton}>
            <Icon
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={COLORS.textLight}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.detailsGrid}>
        {visibleDetails.map((detail, index) => (
          <View key={index} style={styles.detailItem}>
            <View style={styles.detailHeader}>
              <View style={[styles.iconContainer, { backgroundColor: detail.color + '20' }]}>
                <Icon name={detail.icon} size={16} color={detail.color} />
              </View>
              <Text style={styles.detailLabel}>{detail.label}</Text>
            </View>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>{detail.value}</Text>
              {detail.unit && (
                <Text style={styles.detailUnit}>{detail.unit}</Text>
              )}
            </View>
          </View>
        ))}
      </View>

      {showToggle && !expanded && details.length > 4 && (
        <TouchableOpacity onPress={onToggle} style={styles.viewMoreButton}>
          <Text style={styles.viewMoreText}>
            View {details.length - 4} more details
          </Text>
          <Icon name="chevron-down" size={16} color={COLORS.primary} />
        </TouchableOpacity>
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
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
  },
  toggleButton: {
    padding: SPACING.xs,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    backgroundColor: `${COLORS.primary}08`,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.xs,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    flex: 1,
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  detailValue: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginRight: 2,
  },
  detailUnit: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: SPACING.sm,
  },
  viewMoreText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginRight: SPACING.xs,
  },
});

export default WeatherDetailCard;