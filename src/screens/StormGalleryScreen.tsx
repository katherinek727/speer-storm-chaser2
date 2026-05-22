/**
 * Storm Gallery Screen - Browse documented storm events
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  STORM_TYPES,
} from '../constants';

type StormGalleryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'StormGallery'
>;

interface Props {
  navigation: StormGalleryScreenNavigationProp;
}

interface StormItem {
  id: string;
  title: string;
  date: string;
  location: string;
  stormType: string;
  description: string;
  imageColor: string;
}

const StormGalleryScreen: React.FC<Props> = ({ navigation }) => {
  const [storms, setStorms] = React.useState<StormItem[]>([
    {
      id: '1',
      title: 'Thunderstorm Over Mountains',
      date: 'May 15, 2024 • 14:30',
      location: 'Rocky Mountains, CO',
      stormType: 'thunderstorm',
      description: 'Intense lightning activity with heavy rainfall',
      imageColor: '#FF9800',
    },
    {
      id: '2',
      title: 'Coastal Hurricane Watch',
      date: 'Aug 22, 2024 • 09:15',
      location: 'Gulf Coast, FL',
      stormType: 'hurricane',
      description: 'Category 3 hurricane approaching coastline',
      imageColor: '#9C27B0',
    },
    {
      id: '3',
      title: 'Winter Blizzard',
      date: 'Jan 10, 2024 • 11:45',
      location: 'Great Lakes, MI',
      stormType: 'blizzard',
      description: 'Heavy snowfall with strong winds',
      imageColor: '#2196F3',
    },
    {
      id: '4',
      title: 'Tornado Warning',
      date: 'Apr 5, 2024 • 16:20',
      location: 'Tornado Alley, OK',
      stormType: 'tornado',
      description: 'Funnel cloud spotted near residential area',
      imageColor: '#F44336',
    },
  ]);

  const getStormTypeColor = (type: string): string => {
    const stormType = STORM_TYPES.find((t) => t.value === type);
    return stormType?.color || COLORS.textLight;
  };

  const getStormTypeIcon = (type: string): string => {
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
      default:
        return 'weather-cloudy';
    }
  };

  const renderStormItem = ({ item }: { item: StormItem }) => (
    <TouchableOpacity
      style={[styles.stormCard, SHADOWS.md]}
      onPress={() => {
        // Navigate to storm detail view
      }}>
      <View style={styles.stormCardHeader}>
        <View
          style={[
            styles.stormTypeIndicator,
            { backgroundColor: getStormTypeColor(item.stormType) },
          ]}>
          <Icon
            name={getStormTypeIcon(item.stormType)}
            size={16}
            color="#FFFFFF"
          />
        </View>
        <Text style={styles.stormTypeText}>
          {STORM_TYPES.find((t) => t.value === item.stormType)?.label ||
            item.stormType}
        </Text>
      </View>

      <View style={styles.imagePlaceholder}>
        <View
          style={[
            styles.imageColor,
            { backgroundColor: item.imageColor + '40' },
          ]}>
          <Icon name="image" size={48} color={item.imageColor} />
          <Text style={[styles.imageText, { color: item.imageColor }]}>
            Storm Photo
          </Text>
        </View>
      </View>

      <View style={styles.stormCardContent}>
        <Text style={styles.stormTitle}>{item.title}</Text>
        <View style={styles.stormMeta}>
          <View style={styles.metaItem}>
            <Icon name="calendar" size={14} color={COLORS.textLight} />
            <Text style={styles.metaText}>{item.date}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="map-marker" size={14} color={COLORS.textLight} />
            <Text style={styles.metaText}>{item.location}</Text>
          </View>
        </View>
        <Text style={styles.stormDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>

      <View style={styles.stormCardFooter}>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Details</Text>
          <Icon name="chevron-right" size={16} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <Icon name="share-variant" size={18} color={COLORS.textLight} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Storm Gallery</Text>
            <Text style={styles.subtitle}>
              Browse your documented storm events
            </Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Icon name="filter-variant" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {storms.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon
              name="weather-cloudy"
              size={64}
              color={COLORS.textLighter}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>No Storms Documented Yet</Text>
            <Text style={styles.emptyDescription}>
              Start documenting storms using the "Document Storm" feature to see
              them here.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('StormDocumentation')}>
              <Text style={styles.emptyButtonText}>Document First Storm</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.statsBar}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{storms.length}</Text>
                <Text style={styles.statLabel}>Total Storms</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {new Set(storms.map((s) => s.stormType)).size}
                </Text>
                <Text style={styles.statLabel}>Storm Types</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {new Set(storms.map((s) => s.location)).size}
                </Text>
                <Text style={styles.statLabel}>Locations</Text>
              </View>
            </View>

            <FlatList
              data={storms}
              renderItem={renderStormItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.stormList}
            />

            <View style={styles.importSection}>
              <Text style={styles.importTitle}>Storage Integration</Text>
              <Text style={styles.importDescription}>
                Real storm data will be stored locally using AsyncStorage or
                SQLite. Implement data persistence to save and retrieve your
                documented storms.
              </Text>
              <View style={styles.importFeatures}>
                <View style={styles.featureItem}>
                  <Icon name="database" size={20} color={COLORS.success} />
                  <Text style={styles.featureText}>Local Storage</Text>
                </View>
                <View style={styles.featureItem}>
                  <Icon name="image" size={20} color={COLORS.primary} />
                  <Text style={styles.featureText}>Photo Storage</Text>
                </View>
                <View style={styles.featureItem}>
                  <Icon name="search" size={20} color={COLORS.accent} />
                  <Text style={styles.featureText}>Search & Filter</Text>
                </View>
              </View>
            </View>
          </>
        )}
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
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: `${COLORS.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.md,
  },
  emptyIcon: {
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  emptyButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.surface,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
  stormList: {
    paddingBottom: SPACING.md,
  },
  stormCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  stormCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  stormTypeIndicator: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  stormTypeText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
  },
  imagePlaceholder: {
    height: 180,
    backgroundColor: `${COLORS.primary}05`,
  },
  imageColor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginTop: SPACING.sm,
  },
  stormCardContent: {
    padding: SPACING.md,
  },
  stormTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  stormMeta: {
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
  stormDescription: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
    lineHeight: 20,
  },
  stormCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.primary,
    marginRight: SPACING.xs,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: `${COLORS.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  importSection: {
    backgroundColor: `${COLORS.info}10`,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
  },
  importTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.info,
    marginBottom: SPACING.sm,
  },
  importDescription: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textLight,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  importFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});

export default StormGalleryScreen;