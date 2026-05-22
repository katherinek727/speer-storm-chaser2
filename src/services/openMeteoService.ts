/**
 * Open-Meteo Weather API Service
 * Free weather API without API key requirement
 * Documentation: https://open-meteo.com/
 */

import axios from 'axios';
import { WeatherData, WeatherLocation, WeatherUnits, ApiResponse, WeatherForecast, DailyForecast, WeatherApiResponse } from '../types';
import { getWeatherCondition } from './weatherService';

// Open-Meteo API response types
interface OpenMeteoCurrentResponse {
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    weather_code: number;
    pressure_msl: number;
    surface_pressure: number;
    cloud_cover: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    visibility?: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    apparent_temperature: number[];
    precipitation: number[];
    pressure_msl: number[];
    cloud_cover: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    weather_code: number[];
    visibility?: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_probability_max: number[];
    sunrise: string[];
    sunset: string[];
  };
}

interface OpenMeteoGeocodingResponse {
  results: Array<{
    latitude: number;
    longitude: number;
    name: string;
    country: string;
    admin1?: string;
    timezone: string;
  }>;
}

const BASE_URL = 'https://api.open-meteo.com/v1';

// Open-Meteo API parameters
const DEFAULT_PARAMS = {
  current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,pressure_msl,surface_pressure,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
  hourly: 'temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weather_code,pressure_msl,surface_pressure,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,visibility,wind_speed_10m,wind_speed_80m,wind_speed_120m,wind_speed_180m,wind_direction_10m,wind_direction_80m,wind_direction_120m,wind_direction_180m,wind_gusts_10m,temperature_80m,temperature_120m,temperature_180m',
  daily: 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant',
  timezone: 'auto',
  forecast_days: 7,
};

/**
 * Get current weather data by coordinates
 */
export const getCurrentWeatherByCoordinates = async (
  latitude: number,
  longitude: number,
  units: WeatherUnits = { temperature: 'F', windSpeed: 'mph', precipitation: 'in', pressure: 'hPa' }
): Promise<ApiResponse<WeatherData>> => {
  try {
    const response = await axios.get<OpenMeteoCurrentResponse>(`${BASE_URL}/forecast`, {
      params: {
        latitude,
        longitude,
        current: DEFAULT_PARAMS.current,
        hourly: DEFAULT_PARAMS.hourly,
        daily: DEFAULT_PARAMS.daily,
        timezone: DEFAULT_PARAMS.timezone,
        forecast_days: 1,
      },
    });

    const data = response.data;
    
    // Convert to our WeatherData format
    const weatherData: WeatherData = {
      temperature: convertTemperature(data.current.temperature_2m, units.temperature),
      feelsLike: convertTemperature(data.current.apparent_temperature, units.temperature),
      humidity: data.current.relative_humidity_2m,
      windSpeed: convertWindSpeed(data.current.wind_speed_10m, units.windSpeed),
      windDirection: data.current.wind_direction_10m,
      precipitation: convertPrecipitation(data.current.precipitation, units.precipitation),
      pressure: data.current.pressure_msl,
      cloudCover: data.current.cloud_cover,
      visibility: data.current.visibility || 10, // Default if not available
      condition: getWeatherCondition(data.current.weather_code),
      location: {
        latitude,
        longitude,
      },
      timestamp: data.current.time,
      units,
    };

    return {
      data: weatherData,
      success: true,
      message: 'Weather data retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('Open-Meteo API error:', error);
    return {
      data: {} as WeatherData,
      success: false,
      message: `Failed to fetch weather data: ${error.message}`,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Get weather forecast for multiple days
 */
export const getWeatherForecastByCoordinates = async (
  latitude: number,
  longitude: number,
  days: number = 5,
  units: WeatherUnits = { temperature: 'F', windSpeed: 'mph', precipitation: 'in', pressure: 'hPa' }
): Promise<ApiResponse<WeatherForecast>> => {
  try {
    const response = await axios.get<OpenMeteoCurrentResponse>(`${BASE_URL}/forecast`, {
      params: {
        latitude,
        longitude,
        current: DEFAULT_PARAMS.current,
        hourly: DEFAULT_PARAMS.hourly,
        daily: DEFAULT_PARAMS.daily,
        timezone: DEFAULT_PARAMS.timezone,
        forecast_days: days,
      },
    });

    const data = response.data;
    
    // Current weather
    const currentWeather: WeatherData = {
      temperature: convertTemperature(data.current.temperature_2m, units.temperature),
      feelsLike: convertTemperature(data.current.apparent_temperature, units.temperature),
      humidity: data.current.relative_humidity_2m,
      windSpeed: convertWindSpeed(data.current.wind_speed_10m, units.windSpeed),
      windDirection: data.current.wind_direction_10m,
      precipitation: convertPrecipitation(data.current.precipitation, units.precipitation),
      pressure: data.current.pressure_msl,
      cloudCover: data.current.cloud_cover,
      visibility: data.current.visibility || 10,
      condition: getWeatherCondition(data.current.weather_code),
      location: {
        latitude,
        longitude,
      },
      timestamp: data.current.time,
      units,
    };

    // Hourly forecast (next 24 hours)
    const hourlyForecast: WeatherData[] = [];
    const hourlyCount = Math.min(24, data.hourly.time.length);
    
    for (let i = 0; i < hourlyCount; i++) {
      hourlyForecast.push({
        temperature: convertTemperature(data.hourly.temperature_2m[i], units.temperature),
        feelsLike: convertTemperature(data.hourly.apparent_temperature[i], units.temperature),
        humidity: data.hourly.relative_humidity_2m[i],
        windSpeed: convertWindSpeed(data.hourly.wind_speed_10m[i], units.windSpeed),
        windDirection: data.hourly.wind_direction_10m[i],
        precipitation: convertPrecipitation(data.hourly.precipitation[i], units.precipitation),
        pressure: data.hourly.pressure_msl[i],
        cloudCover: data.hourly.cloud_cover[i],
        visibility: data.hourly.visibility?.[i] || 10,
        condition: getWeatherCondition(data.hourly.weather_code[i]),
        location: { latitude, longitude },
        timestamp: data.hourly.time[i],
        units,
      });
    }

    // Daily forecast
    const dailyForecast: DailyForecast[] = [];
    const dailyCount = Math.min(days, data.daily.time.length);
    
    for (let i = 0; i < dailyCount; i++) {
      dailyForecast.push({
        date: data.daily.time[i],
        high: convertTemperature(data.daily.temperature_2m_max[i], units.temperature),
        low: convertTemperature(data.daily.temperature_2m_min[i], units.temperature),
        condition: getWeatherCondition(data.daily.weather_code[i]),
        precipitationChance: data.daily.precipitation_probability_max[i] || 0,
        sunrise: data.daily.sunrise[i],
        sunset: data.daily.sunset[i],
      });
    }

    const forecast: WeatherForecast = {
      hourly: hourlyForecast,
      daily: dailyForecast,
      current: currentWeather,
    };

    return {
      data: forecast,
      success: true,
      message: 'Weather forecast retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('Open-Meteo forecast error:', error);
    return {
      data: {} as WeatherForecast,
      success: false,
      message: `Failed to fetch forecast: ${error.message}`,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Search for locations by name (using Open-Meteo's geocoding API)
 */
export const searchLocations = async (
  query: string,
  count: number = 5
): Promise<ApiResponse<WeatherLocation[]>> => {
  try {
    const response = await axios.get<OpenMeteoGeocodingResponse>('https://geocoding-api.open-meteo.com/v1/search', {
      params: {
        name: query,
        count,
        language: 'en',
        format: 'json',
      },
    });

    if (!response.data.results || response.data.results.length === 0) {
      return {
        data: [],
        success: false,
        message: 'No locations found',
        timestamp: new Date().toISOString(),
      };
    }

    const locations: WeatherLocation[] = response.data.results.map((result) => ({
      latitude: result.latitude,
      longitude: result.longitude,
      name: result.name,
      country: result.country,
      admin1: result.admin1, // State/region
      timezone: result.timezone,
    }));

    return {
      data: locations,
      success: true,
      message: 'Locations found successfully',
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('Location search error:', error);
    return {
      data: [],
      success: false,
      message: `Failed to search locations: ${error.message}`,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Get weather by city name
 */
export const getWeatherByCity = async (
  city: string,
  units: WeatherUnits = { temperature: 'F', windSpeed: 'mph', precipitation: 'in', pressure: 'hPa' }
): Promise<ApiResponse<WeatherData>> => {
  try {
    // First, geocode the city name to get coordinates
    const locationResponse = await searchLocations(city, 1);
    
    if (!locationResponse.success || locationResponse.data.length === 0) {
      return {
        data: {} as WeatherData,
        success: false,
        message: `City "${city}" not found`,
        timestamp: new Date().toISOString(),
      };
    }

    const location = locationResponse.data[0];
    
    // Then get weather for those coordinates
    return await getCurrentWeatherByCoordinates(
      location.latitude,
      location.longitude,
      units
    );
  } catch (error: any) {
    console.error('City weather error:', error);
    return {
      data: {} as WeatherData,
      success: false,
      message: `Failed to get weather for city: ${error.message}`,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Convert temperature from Celsius to Fahrenheit if needed
 */
const convertTemperature = (celsius: number, targetUnit: 'C' | 'F'): number => {
  if (targetUnit === 'F') {
    return (celsius * 9/5) + 32;
  }
  return celsius;
};

/**
 * Convert wind speed from m/s to mph or kph if needed
 */
const convertWindSpeed = (mps: number, targetUnit: 'mph' | 'kph' | 'm/s'): number => {
  switch (targetUnit) {
    case 'mph':
      return mps * 2.23694; // m/s to mph
    case 'kph':
      return mps * 3.6; // m/s to kph
    default:
      return mps;
  }
};

/**
 * Convert precipitation from mm to inches if needed
 */
const convertPrecipitation = (mm: number, targetUnit: 'mm' | 'in'): number => {
  if (targetUnit === 'in') {
    return mm / 25.4;
  }
  return mm;
};

/**
 * Get air quality data (if available)
 */
export const getAirQuality = async (
  latitude: number,
  longitude: number
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(`${BASE_URL}/air-quality`, {
      params: {
        latitude,
        longitude,
        hourly: 'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,aerosol_optical_depth,dust,uv_index,uv_index_clear_sky',
        timezone: 'auto',
        forecast_days: 1,
      },
    });

    return {
      data: response.data,
      success: true,
      message: 'Air quality data retrieved',
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('Air quality error:', error);
    return {
      data: {},
      success: false,
      message: `Failed to get air quality: ${error.message}`,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Test API connectivity
 */
export const testApiConnection = async (): Promise<ApiResponse<boolean>> => {
  try {
    // Test with a known location (New York)
    const response = await getCurrentWeatherByCoordinates(40.7128, -74.0060);
    
    return {
      data: response.success,
      success: response.success,
      message: response.success ? 'API connection successful' : 'API connection failed',
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    return {
      data: false,
      success: false,
      message: `API test failed: ${error.message}`,
      timestamp: new Date().toISOString(),
    };
  }
};