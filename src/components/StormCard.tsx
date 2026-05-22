/**
 * Storm Card Component
 * Displays individual storm documentation in a card format
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, STORM_TYPES } from '../constants';
import { StormType } from '../types';
import { StormDocument } from '../services/storageService';
import { formatDate } from '../utils/helpers';

interface StormCardProps {
  storm: StormDocument;
  onPress: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  compact?: boolean;
}

const StormCard: React.FC<StormCardProps> = ({
  storm,
  onPress,
  onShare,
  onDelete,
  compact = false,
}) => {
  const stormTypeConfig = STORM_TYPES.find((t) => t.value === storm.stormType);
  const stormColor = stormTypeConfig?.color || COLORS.textLight;

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

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactCard, SHADOWS.sm]}
        onPress={onPress}
        activeOpacity={0.7}>
        <View style={styles.compactHeader}>
          <View style={[styles.compactIcon, { backgroundColor: stormColor + '20' }]}>
            <Icon
              name={getStormIcon(storm.stormType)}
              size={16}
              color={stormColor}
            />
          </View>
          <Text style={styles.compactTitle} numberOfLines={1}>
            {storm.notes.split('\n')[0] || 'Storm Event'}
          </Text>
          <Text style={styles.compactDate}>
            {formatDate(storm.createdAt).split(',')[0]}
          </Text>
        </View>
        <View style={styles.compactFooter}>
          <Text style={styles.compactLocation} numberOfLines={1}>
            {storm.location || 'Unknown Location'}
          </Text>
          <Text style={styles.compactCondition}>
            {storm.weatherCondition}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.card, SHADOWS.md]}
      onPress={onPress}
      activeOpacity={0.7}>
      {/* Header with storm type and actions */}
      <View style={styles.header}>
        <View style={styles.stormTypeContainer}>
          <View style={[styles.stormTypeIcon, { backgroundColor: stormColor }]}>
            <Icon
              name={getStormIcon(storm.stormType)}
              size={16}
              color={COLORS.surface}
            />
          </View>
          <Text style={styles.stormTypeText}>
            {stormTypeConfig?.label || storm.stormType}
          </Text>
        </View>
        <View style={styles.actionButtons}>
          {onShare && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                onShare();
              }}>
              <Icon name="share-variant" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                onDelete();
              }}>
              <Icon name="delete" size={18} color={COLORS.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Photo preview */}
      <View style={styles.photoContainer}>
        {storm.photo?.uri ? (
          <Image source={{ uri: storm.photo.uri }} style={styles.photo} />
        ) : (
          <View style={[styles.photoPlaceholder, { backgroundColor: stormColor + '20' }]}>
            <Icon name="image" size={48} color={stormColor} />
            <Text style={[styles.photoPlaceholderText, { color: stormColor }]}>
              No Photo
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {storm.notes.split('\n')[0] || 'Storm Documentation'}
        </Text>
        
        <View style={styles.metadata}>
          <View style={styles.metaItem}>
            <Icon name="calendar" size={14} color={COLORS.textLight} />
            <Text style={styles.metaText}>
              {formatDate(storm.createdAt)}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="map-marker" size={14} color={COLORS.textLight} />
            <Text style={styles.metaText} numberOfLines={1}>
              {storm.location || 'Unknown Location'}
            </Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {storm.notes.length > 100
            ? storm.notes.substring(0, 100) + '...'
            : storm.notes}
        </Text>

        {/* Weather conditions */}
        <View style={styles.conditions}>
          <Text style={styles.conditionsLabel}>Conditions:</Text>
          <Text style={styles.conditionsText}>{storm.weatherCondition}</Text>
        </View>

        {/* Weather metrics */}
        {storm.photo?.location && (
          <View style={styles.metrics}>
            <View style={styles.metricItem}>
              <Icon name="latitude" size={12} color={COLORS.primary} />
              <Text style={styles.metricText}>
                {storm.photo.location.latitude.toFixed(4)}°
              </Text>
            </View>
            <View style={styles.metricItem}>
              <Icon name="longitude" size={12} color={COLORS.secondary} />
              <Text style={styles.metricText}>
                {storm.photo.location.longitude.toFixed(4)}°
              </Text>
            </View>
            {storm.photo.location.altitude !== undefined && (
              <View style={styles.metricItem}>
                <Icon name="altimeter" size={12} color={COLORS.info} />
                <Text style={styles.metricText}>
                  {Math.round(storm.photo.location.altitude)} ft
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.viewDetails}>
          View Details →
        </Text>
        <Text style={styles.idText}>
          ID: {storm.id.substring(0, 8)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginVertical: SPACING.sm,
    overflow: 'hidden',
  },
  compactCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginVertical: SPACING.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  stormTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stormTypeIcon: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  stormTypeText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: `${COLORS.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.xs,
  },
  photoContainer: {
    height: 180,
    backgroundColor: COLORS.background,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginTop: SPACING.xs,
  },
  content: {
    padding: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  metadata: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  metaText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  conditions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  conditionsLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.text,
    marginRight: SPACING.xs,
  },
  conditionsText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    flex: 1,
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}10`,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  metricText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text,
    marginLeft: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  viewDetails: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.primary,
  },
  idText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textLighter,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  compactIcon: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  compactTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    flex: 1,
  },
  compactDate: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textLight,
  },
  compactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactLocation: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    flex: 1,
  },
  compactCondition: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textLighter,
    backgroundColor: `${COLORS.primary}10`,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
});

export default StormCard;