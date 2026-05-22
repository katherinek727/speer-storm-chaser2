/**
 * Application constants
 */

export const COLORS = {
  primary: '#4A90E2',
  primaryDark: '#357ABD',
  secondary: '#50E3C2',
  accent: '#FF6B6B',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  text: '#333333',
  textLight: '#666666',
  textLighter: '#999999',
  border: '#E1E5E9',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
};

export const TYPOGRAPHY = {
  fontFamily: 'System',
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Weather API Configuration
export const WEATHER_API = {
  BASE_URL: 'https://api.open-meteo.com/v1',
  ENDPOINTS: {
    CURRENT_WEATHER: '/forecast',
  },
  PARAMS: {
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,pressure_msl,surface_pressure,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
    hourly: 'temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weather_code,pressure_msl,surface_pressure,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,visibility,wind_speed_10m,wind_speed_80m,wind_speed_120m,wind_speed_180m,wind_direction_10m,wind_direction_80m,wind_direction_120m,wind_direction_180m,wind_gusts_10m,temperature_80m,temperature_120m,temperature_180m',
  },
};

// Storm Types
export const STORM_TYPES = [
  { value: 'thunderstorm', label: 'Thunderstorm', color: '#FF9800' },
  { value: 'tornado', label: 'Tornado', color: '#F44336' },
  { value: 'hurricane', label: 'Hurricane', color: '#9C27B0' },
  { value: 'blizzard', label: 'Blizzard', color: '#2196F3' },
  { value: 'flood', label: 'Flood', color: '#3F51B5' },
  { value: 'hail', label: 'Hail', color: '#00BCD4' },
  { value: 'other', label: 'Other', color: '#607D8B' },
];

// Weather Conditions
export const WEATHER_CONDITIONS = [
  'Clear',
  'Partly Cloudy',
  'Cloudy',
  'Rain',
  'Heavy Rain',
  'Thunderstorm',
  'Snow',
  'Fog',
  'Windy',
  'Hail',
  'Tornado Warning',
  'Hurricane Warning',
];