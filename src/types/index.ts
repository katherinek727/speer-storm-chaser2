/**
 * Type definitions for Storm Chaser App
 */

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  pressure: number;
  cloudCover: number;
  visibility: number;
  condition: string;
  location: {
    latitude: number;
    longitude: number;
    name?: string;
  };
  timestamp: string;
}

export interface StormDocument {
  id: string;
  imageUri: string;
  weatherConditions: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  dateTime: string;
  notes: string;
  stormType: StormType;
  metadata: {
    temperature?: number;
    windSpeed?: number;
    precipitation?: number;
  };
}

export type StormType = 
  | 'thunderstorm'
  | 'tornado'
  | 'hurricane'
  | 'blizzard'
  | 'flood'
  | 'hail'
  | 'other';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  timestamp: string;
}