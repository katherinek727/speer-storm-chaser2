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

type StormDocumentationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'StormDocumentation'
>;

interface Props {
  navigation: StormDocumentationScreenNavigationProp;
}

const StormDocumentationScreen: React.FC<Props> = ({ navigation }) => {
  const [stormType, setStormType] = React.useState<string>('thunderstorm');
  const [weatherCondition, setWeatherCondition] = React.useState<string>('');
  const [notes, setNotes] = React.useState<string>('');
  const [location, setLocation] = React.useState<string>('');

  const handleTakePhoto = () => {
    Alert.alert(
      'Camera Integration Required',
      'Camera functionality needs to be implemented using react-native-camera or react-native-image-picker.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Learn More', onPress: () => {} },
      ],
    );
  };

  const handleSaveDocumentation = () => {
    if (!weatherCondition.trim()) {
      Alert.alert('Validation Error', 'Please select a weather condition');
      return;
    }

    Alert.alert(
      'Success',
      'Storm documentation saved! (Mock implementation - Real storage needed)',
      [{ text: 'OK', onPress: () => navigation.goBack() }],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Document Storm Event</Text>
        <Text style={styles.subtitle}>
          Capture photos and add metadata for storm documentation
        </Text>

        {/* Camera Section */}
        <View style={[styles.section, SHADOWS.md]}>
          <Text style={styles.sectionTitle}>Capture Photo</Text>
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={handleTakePhoto}>
            <View style={styles.cameraIconContainer}>
              <Icon name="camera" size={48} color={COLORS.surface} />
            </View>
            <Text style={styles.cameraButtonText}>Tap to Take Photo</Text>
            <Text style={styles.cameraHint}>
              Camera integration required for real functionality
            </Text>
          </TouchableOpacity>
        </View>

        {/* Storm Type Selection */}
        <View style={[styles.section, SHADOWS.md]}>
          <Text style={styles.sectionTitle}>Storm Type</Text>
          <View style={styles.stormTypeGrid}>
            {STORM_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.stormTypeButton,
                  stormType === type.value && styles.stormTypeButtonSelected,
                  { borderColor: type.color },
                ]}
                onPress={() => setStormType(type.value)}>
                <View
                  style={[
                    styles.stormTypeIcon,
                    { backgroundColor: type.color },
                  ]}>
                  <Icon
                    name={
                      type.value === 'thunderstorm'
                        ? 'lightning-bolt'
                        : type.value === 'tornado'
                        ? 'weather-tornado'
                        : type.value === 'hurricane'
                        ? 'weather-hurricane'
                        : type.value === 'blizzard'
                        ? 'snowflake'
                        : type.value === 'flood'
                        ? 'water'
                        : type.value === 'hail'
                        ? 'weather-hail'
                        : 'weather-cloudy'
                    }
                    size={20}
                    color="#FFFFFF"
                  />
                </View>
                <Text
                  style={[
                    styles.stormTypeText,
                    stormType === type.value && styles.stormTypeTextSelected,
                  ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Weather Conditions */}
        <View style={[styles.section, SHADOWS.md]}>
          <Text style={styles.sectionTitle}>Weather Conditions</Text>
          <View style={styles.weatherConditionsGrid}>
            {WEATHER_CONDITIONS.slice(0, 6).map((condition) => (
              <TouchableOpacity
                key={condition}
                style={[
                  styles.conditionButton,
                  weatherCondition === condition &&
                    styles.conditionButtonSelected,
                ]}
                onPress={() => setWeatherCondition(condition)}>
                <Text
                  style={[
                    styles.conditionText,
                    weatherCondition === condition &&
                      styles.conditionTextSelected,
                  ]}>
                  {condition}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.moreConditionsButton}
            onPress={() => {
              // Show more conditions
              setWeatherCondition(
                WEATHER_CONDITIONS[6] || WEATHER_CONDITIONS[0],
              );
            }}>
            <Text style={styles.moreConditionsText}>More Conditions →</Text>
          </TouchableOpacity>
        </View>

        {/* Location */}
        <View style={[styles.section, SHADOWS.md]}>
          <Text style={styles.sectionTitle}>Location</Text>
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
            />
            <TouchableOpacity
              style={styles.gpsButton}
              onPress={() => setLocation('Current Location (GPS Required)')}>
              <Icon name="crosshairs-gps" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.locationHint}>
            GPS integration required for automatic location detection
          </Text>
        </View>

        {/* Notes */}
        <View style={[styles.section, SHADOWS.md]}>
          <Text style={styles.sectionTitle}>Notes & Description</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add detailed notes about the storm event..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor={COLORS.textLighter}
          />
          <Text style={styles.notesHint}>
            Include observations, intensity, duration, and any notable features
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSaveDocumentation}>
            <Icon name="content-save" size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Save Documentation</Text>
          </TouchableOpacity>
        </View>

        {/* Implementation Notes */}
        <View style={styles.implementationNotes}>
          <Text style={styles.implementationTitle}>
            Implementation Required:
          </Text>
          <View style={styles.implementationList}>
            <View style={styles.implementationItem}>
              <Icon name="camera" size={16} color={COLORS.textLight} />
              <Text style={styles.implementationText}>
                Camera integration (react-native-camera)
              </Text>
            </View>
            <View style={styles.implementationItem}>
              <Icon name="map-marker" size={16} color={COLORS.textLight} />
              <Text style={styles.implementationText}>
                GPS location services
              </Text>
            </View>
            <View style={styles.implementationItem}>
              <Icon name="database" size={16} color={COLORS.textLight} />
              <Text style={styles.implementationText}>
                Local storage (AsyncStorage/SQLite)
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  cameraButton: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  cameraIconContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cameraButtonText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  cameraHint: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLighter,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  stormTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  stormTypeButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  stormTypeButtonSelected: {
    backgroundColor: `${COLORS.primary}10`,
    borderWidth: 2,
  },
  stormTypeIcon: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  stormTypeText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
    flex: 1,
  },
  stormTypeTextSelected: {
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.primary,
  },
  weatherConditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  conditionButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: `${COLORS.primary}10`,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
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
  moreConditionsButton: {
    alignSelf: 'flex-start',
  },
  moreConditionsText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
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
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLighter,
    fontStyle: 'italic',
  },
  notesInput: {
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
    minHeight: 100,
    marginBottom: SPACING.sm,
  },
  notesHint: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLighter,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
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
    marginRight: SPACING.sm,
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
  implementationNotes: {
    backgroundColor: `${COLORS.info}10`,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
  },
  implementationTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.info,
    marginBottom: SPACING.md,
  },
  implementationList: {
    marginLeft: SPACING.sm,
  },
  implementationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  implementationText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textLight,
    marginLeft: SPACING.sm,
    flex: 1,
  },
});

export default StormDocumentationScreen;