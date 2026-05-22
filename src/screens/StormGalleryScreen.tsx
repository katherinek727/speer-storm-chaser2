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
  FlatList,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../src/types/navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  STORM_TYPES,
} from '../constants';
import StormCard from '../components/StormCard';
import FilterBar from '../components/FilterBar';
import { StormType } from '../types';
import { 
  StormDocument, 
  getStormDocuments, 
  getFilteredStormDocuments,
  deleteStormDocument, 
  clearAllStormDocuments,
  getStorageStats,
  FilterOptions
} from '../services/storageService';
import { formatDate } from '../utils/helpers';

type StormGalleryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'StormGallery'
>;

interface Props {
  navigation: StormGalleryScreenNavigationProp;
}

const StormGalleryScreen: React.FC<Props> = ({ navigation }) => {
  const [storms, setStorms] = React.useState<StormDocument[]>([]);
  const [filteredStorms, setFilteredStorms] = React.useState<StormDocument[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<StormType | 'all'>('all');
  const [sortBy, setSortBy] = React.useState<'date' | 'type' | 'location'>('date');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');



  const loadStorms = async () => {
    try {
      // Load from storage service
      const documents = await getStormDocuments();
      setStorms(documents);
      
      // Apply current filters
      const filterOptions: FilterOptions = {
        stormType: selectedType !== 'all' ? selectedType : undefined,
        searchQuery: searchQuery.trim() || undefined,
        sortBy: sortBy,
        sortOrder: sortOrder,
      };
      
      const filtered = await getFilteredStormDocuments(filterOptions);
      setFilteredStorms(filtered);
    } catch (error) {
      console.error('Error loading storms:', error);
      // Fallback to empty array
      setStorms([]);
      setFilteredStorms([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadStorms();
  }, []);

  React.useEffect(() => {
    loadStorms();
  }, []);

  // Apply filters whenever filter states change
  React.useEffect(() => {
    const applyFilters = async () => {
      const filterOptions: FilterOptions = {
        stormType: selectedType !== 'all' ? selectedType : undefined,
        searchQuery: searchQuery.trim() || undefined,
        sortBy: sortBy,
        sortOrder: sortOrder,
      };
      
      const filtered = await getFilteredStormDocuments(filterOptions);
      setFilteredStorms(filtered);
    };

    applyFilters();
  }, [storms, searchQuery, selectedType, sortBy, sortOrder]);

  const handleDeleteStorm = (stormId: string) => {
    Alert.alert(
      'Delete Storm',
      'Are you sure you want to delete this storm documentation? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await deleteStormDocument(stormId);
              if (success) {
                // Reload storms after deletion
                await loadStorms();
              } else {
                Alert.alert('Error', 'Storm document not found');
              }
            } catch (error) {
              console.error('Error deleting storm:', error);
              Alert.alert('Error', 'Failed to delete storm documentation');
            }
          },
        },
      ],
    );
  };

  const handleShareStorm = (storm: StormDocument) => {
    Alert.alert(
      'Share Storm',
      'Choose how you want to share this storm data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'View JSON',
          onPress: () => {
            const stormJson = JSON.stringify(storm, null, 2);
            Alert.alert('Storm Data (JSON)', stormJson.substring(0, 500) + '...');
          },
        },
        {
          text: 'Copy to Clipboard',
          onPress: () => {
            const stormJson = JSON.stringify(storm, null, 2);
            // In real implementation: Clipboard.setString(stormJson);
            Alert.alert('Copied', 'Storm data copied to clipboard (simulated)');
          },
        },
      ],
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Storms',
      'This will delete all storm documentation. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllStormDocuments();
              setStorms([]);
              setFilteredStorms([]);
            } catch (error) {
              console.error('Error clearing all storms:', error);
              Alert.alert('Error', 'Failed to clear storms');
            }
          },
        },
      ],
    );
  };

  const handleViewStormDetails = (storm: StormDocument) => {
    const typeConfig = STORM_TYPES.find(t => t.value === storm.stormType);
    Alert.alert(
      'Storm Details',
      `Storm Type: ${typeConfig?.label || storm.stormType}\n` +
      `Location: ${storm.location}\n` +
      `Date: ${formatDate(storm.createdAt)}\n` +
      `Conditions: ${storm.weatherCondition}\n\n` +
      `${storm.notes.substring(0, 200)}...`,
      [
        { text: 'Close', style: 'cancel' },
        {
          text: 'Edit',
          onPress: () => {
            // Navigate to edit screen (not implemented in this demo)
            Alert.alert('Edit', 'Edit functionality would be implemented here.');
          },
        },
      ],
    );
  };

  const [storageStats, setStorageStats] = React.useState({
    totalDocuments: 0,
    byStormType: {} as Record<StormType, number>,
    byDate: {
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
    },
  });

  const loadStorageStats = async () => {
    try {
      const stats = await getStorageStats();
      setStorageStats(stats);
    } catch (error) {
      console.error('Error loading storage stats:', error);
    }
  };

  React.useEffect(() => {
    loadStorageStats();
  }, [storms]); // Reload stats when storms change

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading storm gallery...</Text>
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
            <Text style={styles.title}>Storm Gallery</Text>
            <Text style={styles.subtitle}>
              Browse and manage your documented storms
            </Text>
          </View>
          <TouchableOpacity
            style={styles.newStormButton}
            onPress={() => navigation.navigate('StormDocumentation' as any)}>
            <Icon name="plus" size={20} color={COLORS.surface} />
            <Text style={styles.newStormButtonText}>New Storm</Text>
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
              Start documenting storms to build your storm chasing portfolio.
              Your documented storms will appear here with photos and metadata.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('StormDocumentation' as any)}>
              <Text style={styles.emptyButtonText}>Document Your First Storm</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Statistics */}
            <View style={[styles.statsCard, SHADOWS.md]}>
              <Text style={styles.statsTitle}>Storm Statistics</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{storageStats.totalDocuments}</Text>
                  <Text style={styles.statLabel}>Total Storms</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{storageStats.byDate.today}</Text>
                  <Text style={styles.statLabel}>Today</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{storageStats.byDate.thisWeek}</Text>
                  <Text style={styles.statLabel}>This Week</Text>
                </View>
              </View>
              
              {/* Storm type distribution */}
              {Object.keys(storageStats.byStormType).length > 0 && (
                <View style={styles.typeDistribution}>
                  <Text style={styles.distributionTitle}>By Storm Type:</Text>
                  <View style={styles.distributionBars}>
                    {Object.entries(storageStats.byStormType).map(([type, count]) => {
                      const typeConfig = STORM_TYPES.find(t => t.value === type);
                      const percentage = (count / storageStats.totalDocuments) * 100;
                      return (
                        <View key={type} style={styles.distributionItem}>
                          <View style={styles.distributionBarContainer}>
                            <View
                              style={[
                                styles.distributionBar,
                                {
                                  width: `${percentage}%`,
                                  backgroundColor: typeConfig?.color || COLORS.textLight,
                                },
                              ]}
                            />
                          </View>
                          <View style={styles.distributionLabel}>
                            <View
                              style={[
                                styles.distributionColor,
                                { backgroundColor: typeConfig?.color || COLORS.textLight },
                              ]}
                            />
                            <Text style={styles.distributionText}>
                              {typeConfig?.label || type}: {count}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>

            {/* Filter Bar */}
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              sortBy={sortBy}
              onSortChange={setSortBy}
              sortOrder={sortOrder}
              onSortOrderToggle={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              resultCount={filteredStorms.length}
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(!showFilters)}
            />

            {/* Storm List */}
            {filteredStorms.length === 0 ? (
              <View style={styles.noResults}>
                <Icon name="magnify-close" size={48} color={COLORS.textLighter} />
                <Text style={styles.noResultsTitle}>No Storms Found</Text>
                <Text style={styles.noResultsText}>
                  Try adjusting your filters or search terms
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredStorms}
                renderItem={({ item }) => (
                  <StormCard
                    storm={item}
                    onPress={() => handleViewStormDetails(item)}
                    onShare={() => handleShareStorm(item)}
                    onDelete={() => handleDeleteStorm(item.id)}
                  />
                )}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.stormList}
              />
            )}

            {/* Actions */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.exportButton]}
                onPress={async () => {
                  try {
                    Alert.alert(
                      'Export Data',
                      'Exporting all storm data to JSON format...',
                    );
                    
                    // In real implementation, this would save to a file
                    // For now, just show a success message
                    Alert.alert(
                      'Export Complete',
                      'All storm data has been exported successfully (simulated).\n\nIn a real implementation, this would save a JSON file to your device.',
                      [{ text: 'OK' }]
                    );
                  } catch (error) {
                    console.error('Error exporting data:', error);
                    Alert.alert('Error', 'Failed to export data');
                  }
                }}>
                <Icon name="export" size={20} color={COLORS.primary} />
                <Text style={styles.exportButtonText}>Export All Data</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.clearButton]}
                onPress={handleClearAll}>
                <Icon name="delete-sweep" size={20} color={COLORS.error} />
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            {/* Storage Integration Info */}
            <View style={styles.storageInfo}>
              <Text style={styles.storageTitle}>Storage Integration</Text>
              <Text style={styles.storageText}>
                This gallery demonstrates how storm data would be stored and
                retrieved using AsyncStorage. In a real implementation:
              </Text>
              <View style={styles.storageFeatures}>
                <View style={styles.storageFeature}>
                  <Icon name="database" size={16} color={COLORS.success} />
                  <Text style={styles.storageFeatureText}>
                    Data persistence across app restarts
                  </Text>
                </View>
                <View style={styles.storageFeature}>
                  <Icon name="search" size={16} color={COLORS.primary} />
                  <Text style={styles.storageFeatureText}>
                    Fast search and filtering
                  </Text>
                </View>
                <View style={styles.storageFeature}>
                  <Icon name="image" size={16} color={COLORS.accent} />
                  <Text style={styles.storageFeatureText}>
                    Photo storage with metadata
                  </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xl,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  newStormButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginLeft: SPACING.md,
    ...SHADOWS.sm,
  },
  newStormButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.surface,
    marginLeft: SPACING.sm,
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
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  emptyButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.surface,
  },
  statsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  statsTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
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
  typeDistribution: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  distributionTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  distributionBars: {
    gap: SPACING.sm,
  },
  distributionItem: {
    marginBottom: SPACING.xs,
  },
  distributionBarContainer: {
    height: 8,
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
    marginBottom: 2,
  },
  distributionBar: {
    height: '100%',
    borderRadius: BORDER_RADIUS.sm,
  },
  distributionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distributionColor: {
    width: 12,
    height: 12,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.xs,
  },
  distributionText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text,
  },
  noResults: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginVertical: SPACING.sm,
    ...SHADOWS.md,
  },
  noResultsTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  noResultsText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  stormList: {
    gap: SPACING.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    flex: 1,
    ...SHADOWS.sm,
  },
  exportButton: {
    backgroundColor: `${COLORS.primary}10`,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  clearButton: {
    backgroundColor: `${COLORS.error}10`,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  exportButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  clearButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.error,
    marginLeft: SPACING.sm,
  },
  storageInfo: {
    backgroundColor: `${COLORS.info}10`,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
  },
  storageTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.info,
    marginBottom: SPACING.sm,
  },
  storageText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  storageFeatures: {
    gap: SPACING.sm,
  },
  storageFeature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storageFeatureText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    flex: 1,
  },
});

export default StormGalleryScreen;