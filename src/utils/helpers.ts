/**
 * Utility functions for Storm Chaser app
 */

import { StormType } from '../types';

/**
 * Format temperature with unit
 */
export const formatTemperature = (temp: number, unit: 'C' | 'F' = 'F'): string => {
  return `${Math.round(temp)}°${unit}`;
};

/**
 * Format wind speed with unit
 */
export const formatWindSpeed = (speed: number, unit: 'mph' | 'kph' = 'mph'): string => {
  return `${Math.round(speed)} ${unit}`;
};

/**
 * Format date to readable string
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get storm type display name
 */
export const getStormTypeDisplayName = (type: StormType): string => {
  const names: Record<StormType, string> = {
    thunderstorm: 'Thunderstorm',
    tornado: 'Tornado',
    hurricane: 'Hurricane',
    blizzard: 'Blizzard',
    flood: 'Flood',
    hail: 'Hail',
    other: 'Other',
  };
  return names[type] || 'Unknown';
};

/**
 * Generate unique ID for storm documents
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Validate weather data
 */
export const validateWeatherData = (data: any): boolean => {
  return (
    data &&
    typeof data.temperature === 'number' &&
    typeof data.windSpeed === 'number' &&
    typeof data.humidity === 'number'
  );
};

/**
 * Calculate distance between two coordinates (in miles)
 * Using Haversine formula
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 3958.8; // Earth's radius in miles
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
 * Debounce function for limiting API calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Check if device is online
 */
export const isOnline = (): boolean => {
  // This would typically check navigator.connection or NetInfo
  return true; // Placeholder
};