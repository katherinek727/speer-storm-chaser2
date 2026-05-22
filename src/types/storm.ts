/**
 * Storm-related type definitions
 */

export interface StormDocument {
  id: string;
  imageUri: string;
  weatherConditions: string;
  location: StormLocation;
  dateTime: string;
  notes: string;
  stormType: StormType;
  metadata: StormMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface StormLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  accuracy?: number;
}

export interface StormMetadata {
  temperature?: number;
  windSpeed?: number;
  precipitation?: number;
  humidity?: number;
  pressure?: number;
  visibility?: number;
  cloudCover?: number;
}

export type StormType = 
  | 'thunderstorm'
  | 'tornado'
  | 'hurricane'
  | 'blizzard'
  | 'flood'
  | 'hail'
  | 'other';

export interface StormFilter {
  stormType?: StormType | 'all';
  dateRange?: {
    start: string;
    end: string;
  };
  locationRadius?: {
    latitude: number;
    longitude: number;
    radius: number; // in kilometers
  };
  searchText?: string;
}

export interface StormStatistics {
  totalStorms: number;
  byType: Record<StormType, number>;
  byMonth: Record<string, number>;
  byLocation: Array<{
    location: string;
    count: number;
  }>;
  recentActivity: StormDocument[];
}