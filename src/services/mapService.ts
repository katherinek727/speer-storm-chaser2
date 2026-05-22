/**
 * Map Service
 * Handles map-related operations and geospatial calculations
 */

import { StormDocument } from './storageService';
import { CameraPhoto } from './cameraService';

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface MapMarker {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
  description: string;
  color: string;
  stormType: string;
  date: string;
  photoUri?: string;
}

export interface ClusterMarker {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  count: number;
  storms: StormDocument[];
  color: string;
}

export interface MapBounds {
  northEast: { latitude: number; longitude: number };
  southWest: { latitude: number; longitude: number };
}

/**
 * Calculate map region from coordinates
 */
export const calculateMapRegion = (
  coordinates: Array<{ latitude: number; longitude: number }>,
  padding: number = 0.1
): MapRegion => {
  if (coordinates.length === 0) {
    return {
      latitude: 40.7128, // New York default
      longitude: -74.0060,
      latitudeDelta: 10,
      longitudeDelta: 10,
    };
  }

  if (coordinates.length === 1) {
    return {
      latitude: coordinates[0].latitude,
      longitude: coordinates[0].longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };
  }

  // Calculate bounds
  let minLat = coordinates[0].latitude;
  let maxLat = coordinates[0].latitude;
  let minLng = coordinates[0].longitude;
  let maxLng = coordinates[0].longitude;

  coordinates.forEach(coord => {
    minLat = Math.min(minLat, coord.latitude);
    maxLat = Math.max(maxLat, coord.latitude);
    minLng = Math.min(minLng, coord.longitude);
    maxLng = Math.max(maxLng, coord.longitude);
  });

  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;
  const latDelta = (maxLat - minLat) + padding;
  const lngDelta = (maxLng - minLng) + padding;

  return {
    latitude: centerLat,
    longitude: centerLng,
    latitudeDelta: Math.max(latDelta, 0.01),
    longitudeDelta: Math.max(lngDelta, 0.01),
  };
};

/**
 * Convert storm documents to map markers
 */
export const convertStormsToMarkers = (
  storms: StormDocument[],
  stormTypeColors: Record<string, string>
): MapMarker[] => {
  return storms
    .filter(storm => storm.photo?.location)
    .map(storm => {
      const location = storm.photo!.location!;
      const stormType = storm.stormType;
      const color = stormTypeColors[stormType] || '#4A90E2';

      return {
        id: storm.id,
        coordinate: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        title: `Storm: ${stormType}`,
        description: `${storm.weatherCondition}\n${storm.location}\n${new Date(storm.createdAt).toLocaleDateString()}`,
        color,
        stormType,
        date: storm.createdAt,
        photoUri: storm.photo?.uri,
      };
    });
};

/**
 * Cluster nearby markers for better performance
 */
export const clusterMarkers = (
  markers: MapMarker[],
  clusterDistance: number = 0.01 // ~1km at equator
): (MapMarker | ClusterMarker)[] => {
  if (markers.length <= 1) return markers;

  const clusters: ClusterMarker[] = [];
  const unclustered: MapMarker[] = [...markers];

  while (unclustered.length > 0) {
    const marker = unclustered.shift()!;
    const nearbyMarkers: MapMarker[] = [marker];

    // Find nearby markers
    for (let i = unclustered.length - 1; i >= 0; i--) {
      const otherMarker = unclustered[i];
      const distance = calculateDistance(
        marker.coordinate.latitude,
        marker.coordinate.longitude,
        otherMarker.coordinate.latitude,
        otherMarker.coordinate.longitude
      );

      if (distance <= clusterDistance) {
        nearbyMarkers.push(otherMarker);
        unclustered.splice(i, 1);
      }
    }

    if (nearbyMarkers.length === 1) {
      // Single marker, no clustering needed
      clusters.push(marker as any);
    } else {
      // Create cluster
      const clusterCenter = calculateClusterCenter(nearbyMarkers);
      const clusterColor = getDominantColor(nearbyMarkers);

      clusters.push({
        id: `cluster-${Date.now()}-${Math.random()}`,
        coordinate: clusterCenter,
        count: nearbyMarkers.length,
        storms: nearbyMarkers.map(m => ({
          id: m.id,
          stormType: m.stormType as any,
          weatherCondition: m.description.split('\n')[0],
          location: m.description.split('\n')[1],
          notes: '',
          photo: {
            uri: m.photoUri || '',
            width: 0,
            height: 0,
            timestamp: m.date,
            location: {
              latitude: m.coordinate.latitude,
              longitude: m.coordinate.longitude,
            },
          },
          createdAt: m.date,
          updatedAt: m.date,
        })),
        color: clusterColor,
      });
    }
  }

  return clusters;
};

/**
 * Calculate cluster center from multiple markers
 */
const calculateClusterCenter = (markers: MapMarker[]): { latitude: number; longitude: number } => {
  const sumLat = markers.reduce((sum, m) => sum + m.coordinate.latitude, 0);
  const sumLng = markers.reduce((sum, m) => sum + m.coordinate.longitude, 0);

  return {
    latitude: sumLat / markers.length,
    longitude: sumLng / markers.length,
  };
};

/**
 * Get dominant color from cluster markers
 */
const getDominantColor = (markers: MapMarker[]): string => {
  const colorCounts: Record<string, number> = {};

  markers.forEach(marker => {
    colorCounts[marker.color] = (colorCounts[marker.color] || 0) + 1;
  });

  let dominantColor = '#4A90E2'; // Default blue
  let maxCount = 0;

  Object.entries(colorCounts).forEach(([color, count]) => {
    if (count > maxCount) {
      maxCount = count;
      dominantColor = color;
    }
  });

  return dominantColor;
};

/**
 * Calculate distance between two coordinates in kilometers
 * Using Haversine formula
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Calculate distance in miles
 */
export const calculateDistanceMiles = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const km = calculateDistance(lat1, lon1, lat2, lon2);
  return km * 0.621371; // Convert km to miles
};

/**
 * Get bounds from map region
 */
export const getBoundsFromRegion = (region: MapRegion): MapBounds => {
  const halfLatDelta = region.latitudeDelta / 2;
  const halfLngDelta = region.longitudeDelta / 2;

  return {
    northEast: {
      latitude: region.latitude + halfLatDelta,
      longitude: region.longitude + halfLngDelta,
    },
    southWest: {
      latitude: region.latitude - halfLatDelta,
      longitude: region.longitude - halfLngDelta,
    },
  };
};

/**
 * Check if coordinate is within bounds
 */
export const isCoordinateInBounds = (
  coordinate: { latitude: number; longitude: number },
  bounds: MapBounds
): boolean => {
  return (
    coordinate.latitude >= bounds.southWest.latitude &&
    coordinate.latitude <= bounds.northEast.latitude &&
    coordinate.longitude >= bounds.southWest.longitude &&
    coordinate.longitude <= bounds.northEast.longitude
  );
};

/**
 * Filter markers by map bounds
 */
export const filterMarkersByBounds = (
  markers: MapMarker[],
  bounds: MapBounds
): MapMarker[] => {
  return markers.filter(marker =>
    isCoordinateInBounds(marker.coordinate, bounds)
  );
};

/**
 * Generate heatmap data from markers
 */
export const generateHeatmapData = (
  markers: MapMarker[],
  gridSize: number = 0.01 // ~1km grid
): Array<{
  latitude: number;
  longitude: number;
  weight: number;
}> => {
  const heatmapData: Record<string, { lat: number; lng: number; weight: number }> = {};

  markers.forEach(marker => {
    const gridLat = Math.round(marker.coordinate.latitude / gridSize) * gridSize;
    const gridLng = Math.round(marker.coordinate.longitude / gridSize) * gridSize;
    const key = `${gridLat},${gridLng}`;

    if (!heatmapData[key]) {
      heatmapData[key] = {
        lat: gridLat,
        lng: gridLng,
        weight: 0,
      };
    }

    heatmapData[key].weight += 1;
  });

  return Object.values(heatmapData).map(point => ({
    latitude: point.lat,
    longitude: point.lng,
    weight: point.weight,
  }));
};

/**
 * Calculate storm density by region
 */
export const calculateStormDensity = (
  markers: MapMarker[],
  region: MapRegion
): number => {
  const area = region.latitudeDelta * region.longitudeDelta;
  if (area === 0) return 0;

  const bounds = getBoundsFromRegion(region);
  const visibleMarkers = filterMarkersByBounds(markers, bounds);

  return visibleMarkers.length / area;
};

/**
 * Get storm type distribution for visible markers
 */
export const getStormTypeDistribution = (
  markers: MapMarker[],
  bounds: MapBounds
): Record<string, number> => {
  const visibleMarkers = filterMarkersByBounds(markers, bounds);
  const distribution: Record<string, number> = {};

  visibleMarkers.forEach(marker => {
    distribution[marker.stormType] = (distribution[marker.stormType] || 0) + 1;
  });

  return distribution;
};

/**
 * Format coordinate for display
 */
export const formatCoordinate = (
  latitude: number,
  longitude: number,
  precision: number = 4
): string => {
  const latDir = latitude >= 0 ? 'N' : 'S';
  const lngDir = longitude >= 0 ? 'E' : 'W';
  
  return `${Math.abs(latitude).toFixed(precision)}°${latDir}, ${Math.abs(longitude).toFixed(precision)}°${lngDir}`;
};

/**
 * Get address from coordinates (mock implementation)
 * In a real app, this would use a reverse geocoding service
 */
export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  // Mock implementation - in real app, use Google Maps Geocoding API or similar
  const addresses = [
    'Nearby Location',
    'Storm Observation Point',
    'Documentation Site',
    'Weather Station',
  ];

  const randomIndex = Math.floor(Math.random() * addresses.length);
  return `${addresses[randomIndex]} (${formatCoordinate(latitude, longitude, 2)})`;
};

/**
 * Calculate bearing between two coordinates
 */
export const calculateBearing = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const φ1 = lat1 * (Math.PI / 180);
  const φ2 = lat2 * (Math.PI / 180);
  const Δλ = (lon2 - lon1) * (Math.PI / 180);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);

  return (θ * (180 / Math.PI) + 360) % 360;
};

/**
 * Generate polyline for storm path (mock)
 */
export const generateStormPath = (
  startCoord: { latitude: number; longitude: number },
  endCoord: { latitude: number; longitude: number },
  points: number = 10
): Array<{ latitude: number; longitude: number }> => {
  const path = [];
  
  for (let i = 0; i <= points; i++) {
    const t = i / points;
    const lat = startCoord.latitude + (endCoord.latitude - startCoord.latitude) * t;
    const lng = startCoord.longitude + (endCoord.longitude - startCoord.longitude) * t;
    
    // Add some randomness to simulate storm movement
    const randomLat = lat + (Math.random() - 0.5) * 0.01;
    const randomLng = lng + (Math.random() - 0.5) * 0.01;
    
    path.push({ latitude: randomLat, longitude: randomLng });
  }
  
  return path;
};