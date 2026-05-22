/**
 * Weather-related type definitions
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
  location: WeatherLocation;
  timestamp: string;
  units?: WeatherUnits;
}

export interface WeatherLocation {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
  city?: string;
  country?: string;
  admin1?: string; // State/region
  timezone?: string;
}

export interface WeatherUnits {
  temperature: 'C' | 'F';
  windSpeed: 'mph' | 'kph' | 'm/s';
  precipitation: 'mm' | 'in';
  pressure: 'hPa' | 'inHg';
}

export interface WeatherForecast {
  hourly: WeatherData[];
  daily: DailyForecast[];
  current: WeatherData;
}

export interface DailyForecast {
  date: string;
  high: number;
  low: number;
  condition: string;
  precipitationChance: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherApiResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: {
    time: string;
    interval: string;
    temperature_2m: string;
    relative_humidity_2m: string;
    apparent_temperature: string;
    precipitation: string;
    rain: string;
    showers: string;
    snowfall: string;
    weather_code: string;
    pressure_msl: string;
    surface_pressure: string;
    cloud_cover: string;
    wind_speed_10m: string;
    wind_direction_10m: string;
    wind_gusts_10m: string;
  };
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
  };
}