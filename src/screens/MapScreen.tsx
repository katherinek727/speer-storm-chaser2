/**
 * Map Screen - Display storm locations on an interactive map
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Callout, Region, PROVIDER_GOOGLE } from 'react-native-maps';
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
import { StormDocument } from '../services/storageService';
import {
  MapRegion,
  MapMarker,
  ClusterMarker,
  convertStormsToMarkers,
  calculateMapRegion,
  clusterMarkers,
  calculateDistanceMiles,
  formatCoordinate,
  getStormTypeDistribution,
} from '../services/mapService';
import { getStormDocuments } from '../services/storageService';

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;

interface Props {
  navigation: MapScreenNavigationProp;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const MapScreen: React.FC<Props> = ({ navigation }) => {
  const mapRef = useRef<MapView>(null);
  const [loading, setLoading] = useState(true);
  const [storms, setStorms] = useState<StormDocument[]>([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [clusteredMarkers, setClusteredMarkers] = useState<(MapMarker | ClusterMarker)[]>([]);
  const [mapRegion, setMapRegion] = useState<MapRegion>({
    latitude: 40.7128, // New York
    longitude: -74.0060,
    latitudeDelta: 10,
    longitudeDelta: 10,
  });
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | ClusterMarker | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [selectedStormType, setSelectedStormType] = useState<string | 'all'>('all');
  const [stormTypeDistribution, setStormTypeDistribution] = useState<Record<string, number>>({});
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid'>('standard');
  const [showClusterInfo, setShowClusterInfo] = useState(false);

  // Storm type colors
  const stormTypeColors: Record<string, string> = {};
  STORM_TYPES.forEach(type => {
    stormTypeColors[type.value] = type.color;
  });

  // Load storms and convert to markers
  const loadStorms = async () => {
    try {
      setLoading(true);
      const documents = await getStormDocuments();
      setStorms(documents);

      // Convert to markers
      const newMarkers = convertStormsToMarkers(documents, stormTypeColors);
      setMarkers(newMarkers);

      // Cluster markers
      const clustered = clusterMarkers(newMarkers, 0.02);
      setClusteredMarkers(clustered);

      // Calculate initial map region
      if (newMarkers.length > 0) {
        const coordinates = newMarkers.map(m => m.coordinate);
        const region = calculateMapRegion(coordinates, 0.2);
        setMapRegion(region);
        
        // Animate to region
        setTimeout(() => {
          mapRef.current?.animateToRegion(region, 1000);
        }, 500);
      }

      // Calculate storm type distribution
      const distribution = getStormTypeDistribution(newMarkers, {
        northEast: { latitude: 90, longitude: 180 },
        southWest: { latitude: -90, longitude: -180 },
      });
      setStormTypeDistribution(distribution);

    } catch (error) {
      console.error('Error loading storms for map:', error);
      Alert.alert('Error', 'Failed to load storm data for map');
    } finally {
      setLoading(false);
    }
  };

  // Handle map region change
  const handleRegionChange = (region: Region) => {
    setMapRegion({
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta,
    });
  };

  // Handle marker press
  const handleMarkerPress = (marker: MapMarker | ClusterMarker) => {
    setSelectedMarker(marker);
  };

  // Handle callout press
  const handleCalloutPress = (marker: MapMarker | ClusterMarker) => {
    if ('count' in marker) {
      // Cluster marker - show cluster details
      setShowClusterInfo(true);
    } else {
      // Single marker - show storm details
      const storm = storms.find(s => s.id === marker.id);
      if (storm) {
        Alert.alert(
          'Storm Details',
          `Type: ${marker.stormType}\n` +
          `Location: ${formatCoordinate(marker.coordinate.latitude, marker.coordinate.longitude)}\n` +
          `Date: ${new Date(marker.date).toLocaleDateString()}\n` +
          `Conditions: ${storm.weatherCondition}`,
          [
            { text: 'Close', style: 'cancel' },
            {
              text: 'View Details',
              onPress: () => {
                // Navigate to storm details screen (not implemented)
                Alert.alert('View Details', 'Storm details screen would open here.');
              },
            },
          ]
        );
      }
    }
  };

  // Filter markers by storm type
  const filteredMarkers = selectedStormType === 'all' 
    ? clusteredMarkers
    : clusteredMarkers.filter(marker => {
        if ('count' in marker) {
          // Cluster contains at least one of selected type
          return marker.storms.some(storm => storm.stormType === selectedStormType);
        } else {
          // Single marker matches type
          return marker.stormType === selectedStormType;
        }
      });

  // Fit map to markers
  const fitToMarkers = () => {
    if (filteredMarkers.length === 0) return;

    const coordinates = filteredMarkers.map(m => 
      'count' in m ? m.coordinate : m.coordinate
    );
    
    const region = calculateMapRegion(coordinates, 0.1);
    mapRef.current?.animateToRegion(region, 1000);
  };

  // Reset to initial view
  const resetView = () => {
    if (markers.length > 0) {
      const coordinates = markers.map(m => m.coordinate);
      const region = calculateMapRegion(coordinates, 0.2);
      mapRef.current?.animateToRegion(region, 1000);
    }
  };

  // Go to user location (mock)
  const goToUserLocation = () => {
    Alert.alert(
      'Current Location',
      'In a real implementation, this would use device GPS to show your current location.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Use Demo Location',
          onPress: () => {
            const demoRegion: MapRegion = {
              latitude: 40.7128,
              longitude: -74.0060,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            };
            mapRef.current?.animateToRegion(demoRegion, 1000);
          },
        },
      ]
    );
  };

  // Initial load
  useEffect(() => {
    loadStorms();
  }, []);

  // Update filtered markers when selection changes
  useEffect(() => {
    const filtered = selectedStormType === 'all' 
      ? clusteredMarkers
      : clusteredMarkers.filter(marker => {
          if ('count' in marker) {
            return marker.storms.some(storm => storm.stormType === selectedStormType);
          } else {
            return marker.stormType === selectedStormType;
          }
        });
    
    // Update state (though we use filteredMarkers directly in render)
    // This is for any side effects
  }, [selectedStormType, clusteredMarkers]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading storm map...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Map View */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={mapRegion}
        onRegionChangeComplete={handleRegionChange}
        mapType={mapType}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        zoomEnabled={true}
        zoomControlEnabled={true}
        rotateEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
      >
        {/* Render markers */}
        {filteredMarkers.map(marker => {
          if ('count' in marker) {
            // Cluster marker
            return (
              <Marker
                key={marker.id}
                coordinate={marker.coordinate}
                onPress={() => handleMarkerPress(marker)}
                tracksViewChanges={false}
              >
                <View style={[styles.clusterMarker, { backgroundColor: marker.color }]}>
                  <Text style={styles.clusterText}>{marker.count}</Text>
                </View>
                <Callout onPress={() => handleCalloutPress(marker)}>
                  <View style={styles.clusterCallout}>
                    <Text style={styles.clusterCalloutTitle}>
                      {marker.count} Storms
                    </Text>
                    <Text style={styles.clusterCalloutText}>
                      Tap to view details
                    </Text>
                  </View>
                </Callout>
              </Marker>
            );
          } else {
            // Single marker
            return (
              <Marker
                key={marker.id}
                coordinate={marker.coordinate}
                onPress={() => handleMarkerPress(marker)}
                tracksViewChanges={false}
              >
                <View style={[styles.singleMarker, { backgroundColor: marker.color }]}>
                  <Icon
                    name={getStormIcon(marker.stormType)}
                    size={16}
                    color={COLORS.surface}
                  />
                </View>
                <Callout onPress={() => handleCalloutPress(marker)}>
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>{marker.title}</Text>
                    <Text style={styles.calloutText}>{marker.description}</Text>
                    <Text style={styles.calloutCoordinate}>
                      {formatCoordinate(marker.coordinate.latitude, marker.coordinate.longitude)}
                    </Text>
                  </View>
                </Callout>
              </Marker>
            );
          }
        })}
      </MapView>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Storm Map</Text>
          <Text style={styles.subtitle}>
            {markers.length} storm locations mapped
          </Text>
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Map Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={fitToMarkers}>
            <Icon name="map-marker-radius" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={resetView}>
            <Icon name="earth" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={goToUserLocation}>
            <Icon name="crosshairs-gps" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setMapType(
              mapType === 'standard' ? 'satellite' :
              mapType === 'satellite' ? 'hybrid' : 'standard'
            )}>
            <Icon name="layers" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setShowFilters(!showFilters)}>
            <Icon name="filter" size={20} color={showFilters ? COLORS.accent : COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setShowLegend(!showLegend)}>
            <Icon name="information" size={20} color={showLegend ? COLORS.accent : COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <View style={styles.filtersPanel}>
          <Text style={styles.filtersTitle}>Filter by Storm Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterButtons}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  selectedStormType === 'all' && styles.filterButtonSelected,
                ]}
                onPress={() => setSelectedStormType('all')}>
                <Text style={[
                  styles.filterButtonText,
                  selectedStormType === 'all' && styles.filterButtonTextSelected,
                ]}>
                  All ({markers.length})
                </Text>
              </TouchableOpacity>
              
              {STORM_TYPES.map(type => {
                const count = stormTypeDistribution[type.value] || 0;
                if (count === 0) return null;
                
                return (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.filterButton,
                      { borderColor: type.color },
                      selectedStormType === type.value && [
                        styles.filterButtonSelected,
                        { backgroundColor: type.color + '20' },
                      ],
                    ]}
                    onPress={() => setSelectedStormType(type.value)}>
                    <View style={[styles.filterColor, { backgroundColor: type.color }]} />
                    <Text style={[
                      styles.filterButtonText,
                      selectedStormType === type.value && styles.filterButtonTextSelected,
                    ]}>
                      {type.label} ({count})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Legend */}
      {showLegend && (
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Storm Types</Text>
          <View style={styles.legendItems}>
            {STORM_TYPES.map(type => (
              <View key={type.value} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: type.color }]} />
                <Text style={styles.legendText}>{type.label}</Text>
              </View>
            ))}
          </View>
          <View style={styles.legendHint}>
            <Icon name="information" size={12} color={COLORS.textLight} />
            <Text style={styles.legendHintText}>
              • Single markers show individual storms
            </Text>
          </View>
          <View style={styles.legendHint}>
            <Icon name="information" size={12} color={COLORS.textLight} />
            <Text style={styles.legendHintText}>
              • Numbered circles show clustered storms
            </Text>
          </View>
        </View>
      )}

      {/* Statistics Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Icon name="map-marker" size={16} color={COLORS.primary} />
          <Text style={styles.statText}>{filteredMarkers.length} locations</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="weather-cloudy" size={16} color={COLORS.primary} />
          <Text style={styles.statText}>
            {Object.keys(stormTypeDistribution).length} storm types
          </Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="refresh" size={16} color={COLORS.primary} />
          <TouchableOpacity onPress={loadStorms}>
            <Text style={styles.statText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cluster Info Modal */}
      <Modal
        visible={showClusterInfo}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowClusterInfo(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMarker && 'count' in selectedMarker && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {selectedMarker.count} Storms in Cluster
                  </Text>
                  <TouchableOpacity onPress={() => setShowClusterInfo(false)}>
                    <Icon name="close" size={24} color={COLORS.text} />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.modalScroll}>
                  {selectedMarker.storms.map((storm, index) => (
                    <View key={index} style={styles.clusterStormItem}>
                      <View style={[
                        styles.clusterStormIcon,
                        { backgroundColor: stormTypeColors[storm.stormType] }
                      ]}>
                        <Icon
                          name={getStormIcon(storm.stormType)}
                          size={16}
                          color={COLORS.surface}
                        />
                      </View>
                      <View style={styles.clusterStormInfo}>
                        <Text style={styles.clusterStormType}>
                          {STORM_TYPES.find(t => t.value === storm.stormType)?.label || storm.stormType}
                        </Text>
                        <Text style={styles.clusterStormLocation}>
                          {storm.location}
                        </Text>
                        <Text style={styles.clusterStormDate}>
                          {new Date(storm.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
                
                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setShowClusterInfo(false)}>
                    <Text style={styles.modalButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Helper function to get storm icon
const getStormIcon = (stormType: string): string => {
  switch (stormType) {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  map: {
    width: screenWidth,
    height: screenHeight,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textLight,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  controlsContainer: {
    position: 'absolute',
    top: 80,
    right: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    ...SHADOWS.md,
  },
  controlsRow: {
    gap: SPACING.sm,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  filtersPanel: {
    position: 'absolute',
    top: 80,
    left: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.lg,
  },
  filtersTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterButtonSelected: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text,
  },
  filterButtonTextSelected: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  filterColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.xs,
  },
  legend: {
    position: 'absolute',
    bottom: 120,
    left: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.lg,
  },
  legendTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.xs,
  },
  legendText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text,
  },
  legendHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  legendHintText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
  },
  statsBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text,
    marginLeft: SPACING.xs,
  },
  // Marker styles
  singleMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
    ...SHADOWS.md,
  },
  clusterMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.surface,
    ...SHADOWS.lg,
  },
  clusterText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.surface,
  },
  // Callout styles
  callout: {
    width: 200,
    padding: SPACING.sm,
  },
  calloutTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  calloutText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  calloutCoordinate: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textLighter,
    fontStyle: 'italic',
  },
  clusterCallout: {
    width: 150,
    padding: SPACING.sm,
  },
  clusterCalloutTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  clusterCalloutText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: screenWidth * 0.9,
    maxHeight: screenHeight * 0.7,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    flex: 1,
  },
  modalScroll: {
    maxHeight: screenHeight * 0.5,
  },
  clusterStormItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  clusterStormIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  clusterStormInfo: {
    flex: 1,
  },
  clusterStormType: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: 2,
  },
  clusterStormLocation: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  clusterStormDate: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textLighter,
  },
  modalFooter: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.surface,
  },
});

export default MapScreen;