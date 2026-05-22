/**
 * Camera View Component
 * Reusable camera interface with controls
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { RNCamera } from 'react-native-camera';

// Camera types from RNCamera
type CameraType = 'front' | 'back';
type FlashMode = 'off' | 'on' | 'auto' | 'torch';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants';
import { CameraPhoto, takePhoto, switchCamera, toggleFlash, adjustZoom } from '../services/cameraService';

interface CameraConfig {
  type: CameraType;
  flashMode: FlashMode;
  zoom: number;
  autoFocus: 'on' | 'off';
  whiteBalance: 'auto' | 'sunny' | 'cloudy' | 'shadow' | 'fluorescent' | 'incandescent';
}

interface CameraViewProps {
  onPhotoTaken: (photo: CameraPhoto) => void;
  onClose: () => void;
  initialConfig?: Partial<CameraConfig>;
}

const { width: screenWidth } = Dimensions.get('window');
const CAMERA_ASPECT_RATIO = 4 / 3;
const CAMERA_HEIGHT = screenWidth / CAMERA_ASPECT_RATIO;

const CameraView: React.FC<CameraViewProps> = ({
  onPhotoTaken,
  onClose,
  initialConfig = {},
}) => {
  const cameraRef = useRef<RNCamera | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraConfig, setCameraConfig] = useState<CameraConfig>({
    type: 'back',
    flashMode: 'off',
    zoom: 0,
    autoFocus: 'on',
    whiteBalance: 'auto',
    ...initialConfig,
  });
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCameraReady = () => {
    setIsLoading(false);
  };

  const handleTakePhoto = async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    try {
      const photo = await takePhoto(cameraRef, {
        quality: 0.8,
        base64: true,
        exif: true,
      });

      if (photo) {
        onPhotoTaken(photo);
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleSwitchCamera = () => {
    setCameraConfig(prev => ({
      ...prev,
      type: switchCamera(prev.type),
    }));
  };

  const handleToggleFlash = () => {
    setCameraConfig(prev => ({
      ...prev,
      flashMode: toggleFlash(prev.flashMode),
    }));
  };

  const handleZoomIn = () => {
    setCameraConfig(prev => ({
      ...prev,
      zoom: adjustZoom(prev.zoom, 0.1),
    }));
  };

  const handleZoomOut = () => {
    setCameraConfig(prev => ({
      ...prev,
      zoom: adjustZoom(prev.zoom, -0.1),
    }));
  };

  const getFlashIcon = () => {
    switch (cameraConfig.flashMode) {
      case 'on':
        return 'flash';
      case 'off':
        return 'flash-off';
      case 'auto':
        return 'flash-auto';
      case 'torch':
        return 'flashlight';
      default:
        return 'flash-off';
    }
  };

  const getFlashColor = () => {
    switch (cameraConfig.flashMode) {
      case 'on':
      case 'torch':
        return COLORS.warning;
      case 'auto':
        return COLORS.info;
      default:
        return COLORS.textLight;
    }
  };

  return (
    <View style={styles.container}>
      {/* Camera Preview */}
      <View style={styles.cameraContainer}>
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Initializing camera...</Text>
          </View>
        )}

        <RNCamera
          ref={cameraRef}
          style={styles.camera}
          type={cameraConfig.type}
          flashMode={cameraConfig.flashMode}
          zoom={cameraConfig.zoom}
          autoFocus={cameraConfig.autoFocus}
          whiteBalance={cameraConfig.whiteBalance}
          onCameraReady={handleCameraReady}
          captureAudio={false}
          ratio="4:3"
        >
          {/* Camera Overlay */}
          <View style={styles.overlay}>
            {/* Top Controls */}
            <View style={styles.topControls}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Icon name="close" size={24} color={COLORS.surface} />
              </TouchableOpacity>

              <View style={styles.zoomControls}>
                <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
                  <Icon name="minus" size={20} color={COLORS.surface} />
                </TouchableOpacity>
                <Text style={styles.zoomText}>{Math.round(cameraConfig.zoom * 100)}%</Text>
                <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
                  <Icon name="plus" size={20} color={COLORS.surface} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Center Capture Area */}
            <View style={styles.captureArea}>
              <View style={styles.captureGuide} />
            </View>

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
              <TouchableOpacity style={styles.controlButton} onPress={handleToggleFlash}>
                <Icon name={getFlashIcon()} size={28} color={getFlashColor()} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.captureButton, isCapturing && styles.capturing]}
                onPress={handleTakePhoto}
                disabled={isCapturing}>
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.controlButton} onPress={handleSwitchCamera}>
                <Icon name="camera-flip" size={28} color={COLORS.surface} />
              </TouchableOpacity>
            </View>
          </View>
        </RNCamera>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          • Tap the circle to take a photo
        </Text>
        <Text style={styles.instructionText}>
          • Use flash and camera flip buttons for better shots
        </Text>
        <Text style={styles.instructionText}>
          • Zoom in/out for detailed shots
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  cameraContainer: {
    width: screenWidth,
    height: CAMERA_HEIGHT,
    backgroundColor: COLORS.text,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.text,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.surface,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  zoomButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.surface,
    marginHorizontal: SPACING.sm,
    minWidth: 40,
    textAlign: 'center',
  },
  captureArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureGuide: {
    width: screenWidth * 0.7,
    height: screenWidth * 0.7 * (3 / 4),
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'transparent',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  capturing: {
    backgroundColor: COLORS.primary,
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.surface,
  },
  instructions: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    marginTop: -BORDER_RADIUS.lg,
  },
  instructionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
});

export default CameraView;