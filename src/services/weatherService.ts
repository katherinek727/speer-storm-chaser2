/**
 * Weather Service
 * Main weather service that uses Open-Meteo API
 */

import { WeatherData, ApiResponse, WeatherLocation, WeatherUnits, WeatherForecast } from '../types';
import { 
  getCurrentWeatherByCoordinates, 
  getWeatherForecastByCoordinates,
  getWeatherByCity,
  searchLocations,
  getAirQuality,
  testApiConnection 
} from './openMeteoService';

// Re-export Open-Meteo functions
export {
  getCurrentWeatherByCoordinates,
  getWeatherForecastByCoordinates,
  getWeatherByCity,
  searchLocations,
  getAirQuality,
  testApiConnection,
};

/**
 * Get current weather data by coordinates
 * (Alias for backward compatibility)
 */
export const getCurrentWeather = getCurrentWeatherByCoordinates;

/**
 * Get weather forecast for the next few days
 * (Alias for backward compatibility)
 */
export const getWeatherForecast = getWeatherForecastByCoordinates;

/**
 * Convert weather code to human-readable condition
 */
export const getWeatherCondition = (code: number): string => {
  // WMO Weather interpretation codes (WW)
  const conditions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };

  return conditions[code] || 'Unknown';
};