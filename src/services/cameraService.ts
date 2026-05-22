/**
 * Camera Service
 * Handles camera operations and permissions
 */

import { Platform, Alert } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { RNCamera } from 'react-native-camera';

// Camera types from RNCamera
type CameraType = 'front' | 'back';
type FlashMode = 'off' | 'on' | 'auto' | 'torch';

export interface CameraPhoto {
  uri: string;
  width: number;
  height: number;
  base64?: string;
  exif?: any;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
    altitude?: number;
    accuracy?: number;
  };
}

export interface CameraConfig {
  type: CameraType;
  flashMode: FlashMode;
  zoom: number;
  autoFocus: 'on' | 'off';
  whiteBalance: 'auto' | 'sunny' | 'cloudy' | 'shadow' | 'fluorescent' | 'incandescent';
}

export const DEFAULT_CAMERA_CONFIG: CameraConfig = {
  type: 'back',
  flashMode: 'off',
  zoom: 0,
  autoFocus: 'on',
  whiteBalance: 'auto',
};

/**
 * Check camera permissions
 */
export const checkCameraPermissions = async (): Promise<boolean> => {
  try {
    let permission;
    
    if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.CAMERA;
    } else {
      permission = PERMISSIONS.ANDROID.CAMERA;
    }

    const result = await check(permission);
    
    switch (result) {
      case RESULTS.GRANTED:
        return true;
      case RESULTS.DENIED:
        const requestResult = await request(permission);
        return requestResult === RESULTS.GRANTED;
      case RESULTS.BLOCKED:
        Alert.alert(
          'Camera Permission Required',
          'Camera permission is blocked. Please enable it in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => {} }, // Would open app settings
          ]
        );
        return false;
      default:
        return false;
    }
  } catch (error) {
    console.error('Error checking camera permissions:', error);
    return false;
  }
};

/**
 * Check location permissions for photo geotagging
 */
export const checkLocationPermissions = async (): Promise<boolean> => {
  try {
    let permission;
    
    if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
    } else {
      permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    }

    const result = await check(permission);
    
    switch (result) {
      case RESULTS.GRANTED:
        return true;
      case RESULTS.DENIED:
        const requestResult = await request(permission);
        return requestResult === RESULTS.GRANTED;
      case RESULTS.BLOCKED:
        Alert.alert(
          'Location Permission Required',
          'Location permission is blocked. Please enable it in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => {} },
          ]
        );
        return false;
      default:
        return false;
    }
  } catch (error) {
    console.error('Error checking location permissions:', error);
    return false;
  }
};

/**
 * Take a photo with the camera
 */
export const takePhoto = async (
  cameraRef: React.RefObject<RNCamera | null>,
  options: {
    quality?: number;
    base64?: boolean;
    exif?: boolean;
    forceUpOrientation?: boolean;
    fixOrientation?: boolean;
  } = {}
): Promise<CameraPhoto | null> => {
  try {
    if (!cameraRef.current) {
      throw new Error('Camera reference is not available');
    }

    const photoOptions = {
      quality: 0.8,
      base64: true,
      exif: true,
      forceUpOrientation: true,
      fixOrientation: true,
      ...options,
    };

    const photo = await cameraRef.current.takePictureAsync(photoOptions);
    
    // Get current location if permissions are granted
    let location;
    const hasLocationPermission = await checkLocationPermissions();
    
    if (hasLocationPermission) {
      // In a real implementation, this would get the current GPS location
      // For now, we'll use mock location data
      location = {
        latitude: 40.7128 + (Math.random() * 0.1 - 0.05), // Random near New York
        longitude: -74.0060 + (Math.random() * 0.1 - 0.05),
        altitude: 10 + Math.random() * 50,
        accuracy: 5 + Math.random() * 15,
      };
    }

    return {
      uri: photo.uri,
      width: photo.width,
      height: photo.height,
      base64: photo.base64,
      exif: photo.exif,
      timestamp: new Date().toISOString(),
      location,
    };
  } catch (error) {
    console.error('Error taking photo:', error);
    Alert.alert('Camera Error', 'Failed to take photo. Please try again.');
    return null;
  }
};

/**
 * Switch between front and back camera
 */
export const switchCamera = (currentType: CameraType): CameraType => {
  return currentType === 'back' ? 'front' : 'back';
};

/**
 * Toggle flash mode
 */
export const toggleFlash = (currentFlashMode: FlashMode): FlashMode => {
  const flashModes: FlashMode[] = ['off', 'on', 'auto', 'torch'];
  const currentIndex = flashModes.indexOf(currentFlashMode);
  const nextIndex = (currentIndex + 1) % flashModes.length;
  return flashModes[nextIndex];
};

/**
 * Adjust camera zoom
 */
export const adjustZoom = (currentZoom: number, delta: number): number => {
  const newZoom = currentZoom + delta;
  return Math.max(0, Math.min(1, newZoom)); // Clamp between 0 and 1
};

/**
 * Get camera preview aspect ratio
 */
export const getCameraAspectRatio = (): string => {
  return Platform.OS === 'ios' ? '4:3' : '16:9';
};

/**
 * Format location for display
 */
export const formatLocation = (location: CameraPhoto['location']): string => {
  if (!location) return 'No location data';
  
  const lat = location.latitude.toFixed(6);
  const lng = location.longitude.toFixed(6);
  return `${lat}°, ${lng}°`;
};

/**
 * Validate photo metadata
 */
export const validatePhotoMetadata = (photo: CameraPhoto): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!photo.uri) {
    errors.push('Photo URI is missing');
  }

  if (!photo.timestamp) {
    errors.push('Timestamp is missing');
  }

  if (photo.width <= 0 || photo.height <= 0) {
    errors.push('Invalid photo dimensions');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Generate mock photo for testing
 */
export const generateMockPhoto = (): CameraPhoto => {
  const timestamp = new Date().toISOString();
  const randomId = Math.random().toString(36).substring(7);
  
  return {
    uri: `file://mock/photo_${randomId}.jpg`,
    width: 1920,
    height: 1080,
    base64: 'mock_base64_data',
    timestamp,
    location: {
      latitude: 40.7128 + (Math.random() * 0.1 - 0.05),
      longitude: -74.0060 + (Math.random() * 0.1 - 0.05),
      altitude: 10 + Math.random() * 50,
      accuracy: 5 + Math.random() * 15,
    },
  };
};