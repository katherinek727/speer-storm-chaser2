/**
 * Storm Type Selector Component
 * Allows selection of storm type with visual indicators
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, STORM_TYPES } from '../constants';
import { StormType } from '../types';

interface StormTypeSelectorProps {
  selectedType: StormType;
  onSelectType: (type: StormType) => void;
  disabled?: boolean;
}

const StormTypeSelector: React.FC<StormTypeSelectorProps> = ({
  selectedType,
  onSelectType,
  disabled = false,
}) => {
  const getStormIcon = (type: StormType): string => {
    switch (type) {
      case 'thunderstorm':
        return 'lightning-bolt';
      case 'tornado':
        return 'weather-tornado';
      case 'hurricane':
        return 'weather-hurricane';
      case 'blizzard':
        return 'snowflake';
      case 'flood':
        return 'water';
      case 'hail':
        return 'weather-hail';
      case 'other':
        return 'weather-cloudy';
      default:
        return 'weather-cloudy';
    }
  };

  const getStormDescription = (type: StormType): string => {
    switch (type) {
      case 'thunderstorm':
        return 'Lightning, thunder, heavy rain';
      case 'tornado':
        'Rotating funnel cloud, high winds';
      case 'hurricane':
        return 'Tropical cyclone, storm surge';
      case 'blizzard':
        return 'Heavy snow, strong winds';
      case 'flood':
        return 'Water overflow, inundation';
      case 'hail':
        return 'Ice pellets, damaging to property';
      case 'other':
        return 'Other storm types';
      default:
        return '';
    }
  };

  return (
    <View style={[styles.card, SHADOWS.md]}>
      <Text style={styles.title}>Storm Type</Text>
      <Text style={styles.subtitle}>
        Select the type of storm you're documenting
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {STORM_TYPES.map((stormType) => {
          const isSelected = selectedType === stormType.value;
          return (
            <TouchableOpacity
              key={stormType.value}
              style={[
                styles.stormTypeButton,
                isSelected && styles.stormTypeButtonSelected,
                { borderColor: stormType.color },
                disabled && styles.disabled,
              ]}
              onPress={() => !disabled && onSelectType(stormType.value as StormType)}
              disabled={disabled}>
              <View
                style={[
                  styles.stormTypeIcon,
                  { backgroundColor: stormType.color },
                  isSelected && styles.stormTypeIconSelected,
                ]}>
                <Icon
                  name={getStormIcon(stormType.value as StormType)}
                  size={24}
                  color={COLORS.surface}
                />
              </View>
              <Text
                style={[
                  styles.stormTypeLabel,
                  isSelected && styles.stormTypeLabelSelected,
                ]}>
                {stormType.label}
              </Text>
              <Text style={styles.stormTypeDescription} numberOfLines={2}>
                {getStormDescription(stormType.value as StormType)}
              </Text>
              {isSelected && (
                <View style={styles.selectedIndicator}>
                  <Icon name="check-circle" size={16} color={COLORS.success} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.selectedInfo}>
        <Text style={styles.selectedLabel}>Selected:</Text>
        <View style={styles.selectedTypeContainer}>
          <View
            style={[
              styles.selectedTypeIcon,
              {
                backgroundColor:
                  STORM_TYPES.find((t) => t.value === selectedType)?.color ||
                  COLORS.textLight,
              },
            ]}>
            <Icon
              name={getStormIcon(selectedType)}
              size={16}
              color={COLORS.surface}
            />
          </View>
          <Text style={styles.selectedTypeText}>
            {STORM_TYPES.find((t) => t.value === selectedType)?.label ||
              'Unknown'}
          </Text>
        </View>
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
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
  },
  scrollContent: {
    paddingRight: SPACING.lg,
  },
  stormTypeButton: {
    width: 140,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginRight: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.sm,
  },
  stormTypeButtonSelected: {
    backgroundColor: `${COLORS.primary}10`,
    borderWidth: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  stormTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  stormTypeIconSelected: {
    transform: [{ scale: 1.1 }],
  },
  stormTypeLabel: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  stormTypeLabelSelected: {
    color: COLORS.primary,
  },
  stormTypeDescription: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textLight,
    lineHeight: 14,
  },
  selectedIndicator: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
  },
  selectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  selectedLabel: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.text,
    marginRight: SPACING.sm,
  },
  selectedTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}10`,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  selectedTypeIcon: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.xs,
  },
  selectedTypeText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
  },
});

export default StormTypeSelector;