/**
 * Feature Card Component
 * Displays app features in a consistent card format
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  disabled?: boolean;
  comingSoon?: boolean;
  onPress?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  color,
  disabled = false,
  comingSoon = false,
  onPress,
}) => {
  const CardContent = () => (
    <View style={[styles.card, SHADOWS.sm, disabled && styles.disabled]}>
      <View style={styles.iconContainer}>
        <View style={[styles.iconBackground, { backgroundColor: color }]}>
          <Icon name={icon} size={24} color={COLORS.surface} />
        </View>
        {comingSoon && (
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Soon</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      </View>

      {!disabled && !comingSoon && (
        <Icon
          name="chevron-right"
          size={20}
          color={COLORS.textLight}
          style={styles.chevron}
        />
      )}
    </View>
  );

  if (onPress && !disabled && !comingSoon) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  disabled: {
    opacity: 0.6,
  },
  iconContainer: {
    position: 'relative',
    marginRight: SPACING.md,
  },
  iconBackground: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoonBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: COLORS.textLighter,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  comingSoonText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.surface,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  chevron: {
    marginLeft: SPACING.sm,
  },
});

export default FeatureCard;