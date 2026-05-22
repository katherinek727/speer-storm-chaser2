/**
 * Photo Capture Card Component
 * Handles photo capture and preview functionality
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import CameraView from './CameraView';
import { CameraPhoto, checkCameraPermissions } from '../services/cameraService';

interface PhotoCaptureCardProps {
  photoUri?: string;
  onTakePhoto: (photo: CameraPhoto) => void;
  onSelectFromGallery: () => void;
  onRemovePhoto: () => void;
  disabled?: boolean;
  error?: string;
}

const PhotoCaptureCard: React.FC<PhotoCaptureCardProps> = ({
  photoUri,
  onTakePhoto,
  onSelectFromGallery,
  onRemovePhoto,
  disabled = false,
  error,
}) => {
  const [showCamera, setShowCamera] = useState(false);
  const [cameraPermissionError, setCameraPermissionError] = useState<string | null>(null);

  const handleOpenCamera = async () => {
    if (disabled) return;

    setCameraPermissionError(null);
    
    try {
      const hasPermission = await checkCameraPermissions();
      
      if (hasPermission) {
        setShowCamera(true);
      } else {
        setCameraPermissionError('Camera permission denied. Please enable camera access in settings.');
      }
    } catch (error) {
      console.error('Error checking camera permissions:', error);
      setCameraPermissionError('Failed to check camera permissions. Please try again.');
    }
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
  };

  const handlePhotoTaken = (photo: CameraPhoto) => {
    setShowCamera(false);
    onTakePhoto(photo);
  };

  const handleMockPhoto = () => {
    // For testing without camera
    const mockPhoto: CameraPhoto = {
      uri: 'https://via.placeholder.com/400x300/4A90E2/FFFFFF?text=Storm+Photo',
      width: 400,
      height: 300,
      timestamp: new Date().toISOString(),
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        altitude: 10,
        accuracy: 5,
      },
    };
    onTakePhoto(mockPhoto);
  };

  return (
    <View style={[styles.card, SHADOWS.md]}>
      <Text style={styles.title}>Storm Photo</Text>
      <Text style={styles.subtitle}>
        Capture or select a photo of the storm event
      </Text>

      {photoUri ? (
        <View style={styles.photoPreviewContainer}>
          <Image source={{ uri: photoUri }} style={styles.photoPreview} />
          <TouchableOpacity
            style={styles.removePhotoButton}
            onPress={onRemovePhoto}>
            <Icon name="close" size={20} color={COLORS.surface} />
          </TouchableOpacity>
          <Text style={styles.photoCaption}>Photo captured successfully</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.captureButton, disabled && styles.disabled]}
          onPress={handleOpenCamera}
          disabled={disabled}>
          <View style={styles.captureIconContainer}>
            <Icon name="camera" size={48} color={COLORS.surface} />
          </View>
          <Text style={styles.captureButtonText}>Tap to Capture Photo</Text>
          <Text style={styles.captureHint}>
            Uses device camera with GPS location tagging
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.photoActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.galleryButton]}
          onPress={onSelectFromGallery}
          disabled={disabled}>
          <Icon name="image-multiple" size={20} color={COLORS.primary} />
          <Text style={styles.galleryButtonText}>Choose from Gallery</Text>
        </TouchableOpacity>
        
        {photoUri ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.retakeButton]}
            onPress={handleOpenCamera}
            disabled={disabled}>
            <Icon name="camera-retake" size={20} color={COLORS.surface} />
            <Text style={styles.retakeButtonText}>Retake Photo</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.mockButton]}
            onPress={handleMockPhoto}
            disabled={disabled}>
            <Icon name="image-filter-none" size={20} color={COLORS.textLight} />
            <Text style={styles.mockButtonText}>Use Mock Photo</Text>
          </TouchableOpacity>
        )}
      </View>

      {(error || cameraPermissionError) && (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={16} color={COLORS.error} />
          <Text style={styles.errorText}>{error || cameraPermissionError}</Text>
        </View>
      )}

      <View style={styles.requirements}>
        <Text style={styles.requirementsTitle}>Photo Requirements:</Text>
        <View style={styles.requirementItem}>
          <Icon name="check-circle" size={14} color={COLORS.success} />
          <Text style={styles.requirementText}>Clear visibility of storm</Text>
        </View>
        <View style={styles.requirementItem}>
          <Icon name="check-circle" size={14} color={COLORS.success} />
          <Text style={styles.requirementText}>Good lighting conditions</Text>
        </View>
        <View style={styles.requirementItem}>
          <Icon name="check-circle" size={14} color={COLORS.success} />
          <Text style={styles.requirementText}>Safe distance maintained</Text>
        </View>
      </View>

      {/* Camera Modal */}
      <Modal
        visible={showCamera}
        animationType="slide"
        onRequestClose={handleCloseCamera}>
        <CameraView
          onPhotoTaken={handlePhotoTaken}
          onClose={handleCloseCamera}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
  },
  captureButton: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  disabled: {
    opacity: 0.5,
  },
  captureIconContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  captureButtonText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  captureHint: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLighter,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  photoPreviewContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
  },
  removePhotoButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  photoCaption: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.success,
    textAlign: 'center',
    marginTop: SPACING.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  photoActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    flex: 1,
  },
  galleryButton: {
    backgroundColor: `${COLORS.primary}10`,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  retakeButton: {
    backgroundColor: COLORS.primary,
  },
  mockButton: {
    backgroundColor: `${COLORS.textLight}20`,
    borderWidth: 1,
    borderColor: COLORS.textLight,
  },
  galleryButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginLeft: SPACING.sm,
  },
  retakeButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.surface,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginLeft: SPACING.sm,
  },
  mockButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textLight,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginLeft: SPACING.sm,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.error}10`,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  errorText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.error,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  requirements: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  requirementsTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  requirementText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    marginLeft: SPACING.sm,
  },
});

export default PhotoCaptureCard;