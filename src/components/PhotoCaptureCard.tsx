/**
 * Photo Capture Card Component
 * Handles photo capture and preview functionality
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';

interface PhotoCaptureCardProps {
  photoUri?: string;
  onTakePhoto: () => void;
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
          onPress={onTakePhoto}
          disabled={disabled}>
          <View style={styles.captureIconContainer}>
            <Icon name="camera" size={48} color={COLORS.surface} />
          </View>
          <Text style={styles.captureButtonText}>Tap to Capture Photo</Text>
          <Text style={styles.captureHint}>
            Requires camera permissions and integration
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
        
        {photoUri && (
          <TouchableOpacity
            style={[styles.actionButton, styles.retakeButton]}
            onPress={onTakePhoto}
            disabled={disabled}>
            <Icon name="camera-retake" size={20} color={COLORS.surface} />
            <Text style={styles.retakeButtonText}>Retake Photo</Text>
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={16} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
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