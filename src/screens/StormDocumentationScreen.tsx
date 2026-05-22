/**
 * Storm Documentation Screen - Capture and document storm events
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../src/types/navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  STORM_TYPES,
  WEATHER_CONDITIONS,
} from '../constants';
import PhotoCaptureCard from '../components/PhotoCaptureCard';
import StormTypeSelector from '../components/StormTypeSelector';
import { StormType } from '../types';

type StormDocumentationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'StormDocumentation'
>;

interface Props {
  navigation: StormDocumentationScreenNavigationProp;
}

const StormDocumentationScreen: React.FC<Props> = ({ navigation }) => {
  const [stormType, setStormType] = React.useState<StormType>('thunderstorm');
  const [weatherCondition, setWeatherCondition] = React.useState<string>('Clear');
  const [notes, setNotes] = React.useState<string>('');
  const [location, setLocation] = React.useState<string>('Current Location');
  const [photoUri, setPhotoUri] = React.useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleTakePhoto = () => {
    Alert.alert(
      'Camera Integration',
      'Camera functionality would be implemented here using react-native-camera or react-native-image-picker.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Use Mock Photo',
          onPress: () => {
            setPhotoUri('https://via.placeholder.com/400x300/4A90E2/FFFFFF?text=Storm+Photo');
          },
        },
      ],
    );
  };

  const handleSelectFromGallery = () => {
    Alert.alert(
      'Gallery Integration',
      'Photo gallery selection would be implemented here.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Use Mock Photo',
          onPress: () => {
            setPhotoUri('https://via.placeholder.com/400x300/50E3C2/FFFFFF?text=Storm+Gallery');
          },
        },
      ],
    );
  };

  const handleRemovePhoto = () => {
    setPhotoUri(undefined);
  };

  const handleUseCurrentLocation = () => {
    Alert.alert(
      'GPS Integration',
      'GPS location services would be implemented here using react-native-geolocation-service.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Use Mock Location',
          onPress: () => {
            setLocation('New York, NY (40.7128° N, 74.0060° W)');
          },
        },
      ],
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!weatherCondition.trim()) {
      newErrors.weatherCondition = 'Please select a weather condition';
    }

    if (!location.trim()) {
      newErrors.location = 'Please enter or select a location';
    }

    if (notes.trim().length < 10) {
      newErrors.notes = 'Please provide more detailed notes (minimum 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDocumentation = () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Success!',
        'Storm documentation has been saved successfully.\n\n' +
        `Storm Type: ${STORM_TYPES.find(t => t.value === stormType)?.label}\n` +
        `Weather: ${weatherCondition}\n` +
        `Location: ${location}\n\n` +
        'In a real implementation, this would be saved to local storage.',
        [
          {
            text: 'View in Gallery',
            onPress: () => navigation.navigate('StormGallery' as any),
          },
          {
            text: 'Document Another',
            onPress: () => {
              setStormType('thunderstorm');
              setWeatherCondition('Clear');
              setNotes('');
              setLocation('Current Location');
              setPhotoUri(undefined);
              setErrors({});
            },
          },
        ],
      );
    }, 1500);
  };

  const handleCancel = () => {
    if (notes.trim() || photoUri) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
        ],
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Document Storm</Text>
            <Text style={styles.subtitle}>
              Capture and document storm events with photos and metadata
            </Text>
          </View>

          {/* Photo Capture */}
          <PhotoCaptureCard
            photoUri={photoUri}
            onTakePhoto={handleTakePhoto}
            onSelectFromGallery={handleSelectFromGallery}
            onRemovePhoto={handleRemovePhoto}
            disabled={isSubmitting}
            error={errors.photo}
          />

          {/* Storm Type Selection */}
          <StormTypeSelector
            selectedType={stormType}
            onSelectType={setStormType}
            disabled={isSubmitting}
          />

          {/* Weather Conditions */}
          <View style={[styles.card, SHADOWS.md]}>
            <Text style={styles.cardTitle}>Weather Conditions</Text>
            <Text style={styles.cardSubtitle}>
              Select the current weather conditions
            </Text>

            <View style={styles.conditionsGrid}>
              {WEATHER_CONDITIONS.map((condition) => (
                <TouchableOpacity
                  key={condition}
                  style={[
                    styles.conditionButton,
                    weatherCondition === condition && styles.conditionButtonSelected,
                    isSubmitting && styles.disabled,
                  ]}
                  onPress={() => !isSubmitting && setWeatherCondition(condition)}>
                  <Text
                    style={[
                      styles.conditionText,
                      weatherCondition === condition && styles.conditionTextSelected,
                    ]}>
                    {condition}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {errors.weatherCondition && (
              <View style={styles.errorMessage}>
                <Icon name="alert-circle" size={14} color={COLORS.error} />
                <Text style={styles.errorText}>{errors.weatherCondition}</Text>
              </View>
            )}
          </View>

          {/* Location */}
          <View style={[styles.card, SHADOWS.md]}>
            <Text style={styles.cardTitle}>Location</Text>
            <Text style={styles.cardSubtitle}>
              Where is the storm occurring?
            </Text>

            <View style={styles.locationContainer}>
              <View style={styles.locationInputContainer}>
                <Icon
                  name="map-marker"
                  size={20}
                  color={COLORS.textLight}
                  style={styles.locationIcon}
                />
                <TextInput
                  style={styles.locationInput}
                  placeholder="Enter location or use current GPS"
                  value={location}
                  onChangeText={setLocation}
                  placeholderTextColor={COLORS.textLighter}
                  editable={!isSubmitting}
                />
                <TouchableOpacity
                  style={[styles.gpsButton, isSubmitting && styles.disabled]}
                  onPress={handleUseCurrentLocation}
                  disabled={isSubmitting}>
                  <Icon name="crosshairs-gps" size={20} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.locationHint}>
                GPS integration available for precise coordinates
              </Text>
            </View>

            {errors.location && (
              <View style={styles.errorMessage}>
                <Icon name="alert-circle" size={14} color={COLORS.error} />
                <Text style={styles.errorText}>{errors.location}</Text>
              </View>
            )}
          </View>

          {/* Notes */}
          <View style={[styles.card, SHADOWS.md]}>
            <Text style={styles.cardTitle}>Notes & Observations</Text>
            <Text style={styles.cardSubtitle}>
              Describe the storm event in detail
            </Text>

            <TextInput
              style={[styles.notesInput, isSubmitting && styles.disabled]}
              placeholder="Describe what you're observing...\n• Storm intensity\n• Duration\n• Notable features\n• Safety concerns\n• Any damage observed"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              placeholderTextColor={COLORS.textLighter}
              editable={!isSubmitting}
            />

            <View style={styles.notesFooter}>
              <Text style={styles.notesCounter}>
                {notes.length}/500 characters
              </Text>
              <Text style={styles.notesHint}>
                Be detailed but concise
              </Text>
            </View>

            {errors.notes && (
              <View style={styles.errorMessage}>
                <Icon name="alert-circle" size={14} color={COLORS.error} />
                <Text style={styles.errorText}>{errors.notes}</Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, isSubmitting && styles.disabled]}
              onPress={handleCancel}
              disabled={isSubmitting}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton, isSubmitting && styles.disabled]}
              onPress={handleSaveDocumentation}
              disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <ActivityIndicator size="small" color={COLORS.surface} />
                  <Text style={styles.saveButtonText}>Saving...</Text>
                </>
              ) : (
                <>
                  <Icon name="content-save" size={20} color={COLORS.surface} />
                  <Text style={styles.saveButtonText}>Save Documentation</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Integration Status */}
          <View style={styles.integrationStatus}>
            <Text style={styles.integrationTitle}>Integration Status</Text>
            <View style={styles.integrationItems}>
              <View style={styles.integrationItem}>
                <Icon name="camera" size={16} color={photoUri ? COLORS.success : COLORS.textLight} />
                <Text style={styles.integrationText}>
                  Camera: {photoUri ? 'Ready' : 'Not configured'}
                </Text>
              </View>
              <View style={styles.integrationItem}>
                <Icon name="map-marker" size={16} color={location.includes('Current') ? COLORS.textLight : COLORS.success} />
                <Text style={styles.integrationText}>
                  GPS: {location.includes('Current') ? 'Mock data' : 'Ready'}
                </Text>
              </View>
              <View style={styles.integrationItem}>
                <Icon name="database" size={16} color={COLORS.success} />
                <Text style={styles.integrationText}>
                  Storage: Ready for integration
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  cardSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
  },
  conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  conditionButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: `${COLORS.primary}10`,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  conditionButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  conditionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text,
  },
  conditionTextSelected: {
    color: COLORS.surface,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  locationContainer: {
    marginBottom: SPACING.sm,
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xs,
  },
  locationIcon: {
    marginRight: SPACING.sm,
  },
  locationInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
  },
  gpsButton: {
    padding: SPACING.sm,
  },
  locationHint: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textLighter,
    fontStyle: 'italic',
  },
  notesInput: {
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  notesFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  notesCounter: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textLight,
  },
  notesHint: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textLighter,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  saveButton: {
    flex: 2,
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
  },
  saveButtonText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.surface,
    marginLeft: SPACING.sm,
  },
  errorMessage: {
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
  disabled: {
    opacity: 0.5,
  },
  integrationStatus: {
    backgroundColor: `${COLORS.info}10`,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
  },
  integrationTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.info,
    marginBottom: SPACING.md,
  },
  integrationItems: {
    gap: SPACING.sm,
  },
  integrationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  integrationText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
});

export default StormDocumentationScreen;