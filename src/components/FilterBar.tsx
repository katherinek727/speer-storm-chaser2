/**
 * Filter Bar Component
 * Provides filtering options for storm gallery
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, STORM_TYPES } from '../constants';
import { StormType } from '../types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: StormType | 'all';
  onTypeChange: (type: StormType | 'all') => void;
  sortBy: 'date' | 'type' | 'location';
  onSortChange: (sort: 'date' | 'type' | 'location') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderToggle: () => void;
  resultCount: number;
  showFilters?: boolean;
  onToggleFilters?: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderToggle,
  resultCount,
  showFilters = false,
  onToggleFilters,
}) => {
  const getSortIcon = (): string => {
    switch (sortBy) {
      case 'date':
        return 'calendar';
      case 'type':
        return 'weather-cloudy';
      case 'location':
        return 'map-marker';
      default:
        return 'sort';
    }
  };

  const getSortLabel = (): string => {
    switch (sortBy) {
      case 'date':
        return 'Date';
      case 'type':
        return 'Type';
      case 'location':
        return 'Location';
      default:
        return 'Sort';
    }
  };

  return (
    <View style={[styles.container, SHADOWS.sm]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color={COLORS.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search storms..."
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholderTextColor={COLORS.textLighter}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => onSearchChange('')}>
            <Icon name="close" size={18} color={COLORS.textLight} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Controls */}
      <View style={styles.controls}>
        {/* Result Count */}
        <View style={styles.resultCount}>
          <Text style={styles.resultCountText}>
            {resultCount} {resultCount === 1 ? 'storm' : 'storms'}
          </Text>
        </View>

        {/* Sort Controls */}
        <View style={styles.sortControls}>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={onSortOrderToggle}>
            <Icon
              name={sortOrder === 'asc' ? 'sort-ascending' : 'sort-descending'}
              size={18}
              color={COLORS.textLight}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => {
              const nextSort = sortBy === 'date' ? 'type' : sortBy === 'type' ? 'location' : 'date';
              onSortChange(nextSort);
            }}>
            <Icon name={getSortIcon()} size={18} color={COLORS.primary} />
            <Text style={styles.sortLabel}>{getSortLabel()}</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Toggle */}
        {onToggleFilters && (
          <TouchableOpacity
            style={[styles.filterToggle, showFilters && styles.filterToggleActive]}
            onPress={onToggleFilters}>
            <Icon name="filter-variant" size={20} color={showFilters ? COLORS.surface : COLORS.primary} />
            <Text style={[styles.filterToggleText, showFilters && styles.filterToggleTextActive]}>
              Filter
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Type Filters (when expanded) */}
      {showFilters && (
        <View style={styles.typeFilters}>
          <TouchableOpacity
            style={[
              styles.typeFilterButton,
              selectedType === 'all' && styles.typeFilterButtonSelected,
            ]}
            onPress={() => onTypeChange('all')}>
            <Text
              style={[
                styles.typeFilterText,
                selectedType === 'all' && styles.typeFilterTextSelected,
              ]}>
              All Types
            </Text>
          </TouchableOpacity>
          
          {STORM_TYPES.map((type) => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.typeFilterButton,
                selectedType === type.value && styles.typeFilterButtonSelected,
                { borderColor: type.color },
              ]}
              onPress={() => onTypeChange(type.value as StormType)}>
              <View style={[styles.typeFilterIcon, { backgroundColor: type.color }]}>
                <Icon
                  name={
                    type.value === 'thunderstorm'
                      ? 'lightning-bolt'
                      : type.value === 'tornado'
                      ? 'weather-tornado'
                      : type.value === 'hurricane'
                      ? 'weather-hurricane'
                      : type.value === 'blizzard'
                      ? 'snowflake'
                      : type.value === 'flood'
                      ? 'water'
                      : type.value === 'hail'
                      ? 'weather-hail'
                      : 'weather-cloudy'
                  }
                  size={12}
                  color={COLORS.surface}
                />
              </View>
              <Text
                style={[
                  styles.typeFilterText,
                  selectedType === type.value && styles.typeFilterTextSelected,
                ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginVertical: SPACING.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
  },
  searchInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
    marginHorizontal: SPACING.sm,
    padding: 0,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultCount: {
    flex: 1,
  },
  resultCountText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  sortControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  sortLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginLeft: 2,
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  filterToggleActive: {
    backgroundColor: COLORS.primary,
  },
  filterToggleText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginLeft: SPACING.xs,
  },
  filterToggleTextActive: {
    color: COLORS.surface,
  },
  typeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  typeFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeFilterButtonSelected: {
    backgroundColor: `${COLORS.primary}10`,
    borderWidth: 2,
  },
  typeFilterIcon: {
    width: 18,
    height: 18,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.xs,
  },
  typeFilterText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text,
  },
  typeFilterTextSelected: {
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.primary,
  },
});

export default FilterBar;