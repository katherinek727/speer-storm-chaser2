/**
 * Storage Service
 * Handles local data persistence for storm documents
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StormDocument, ApiResponse } from '../types';
import { generateId } from '../utils/helpers';

const STORAGE_KEYS = {
  STORM_DOCUMENTS: '@StormChaser:stormDocuments',
  SETTINGS: '@StormChaser:settings',
  LAST_LOCATION: '@StormChaser:lastLocation',
};

/**
 * Save a storm document to local storage
 */
export const saveStormDocument = async (
  document: Omit<StormDocument, 'id'>,
): Promise<ApiResponse<StormDocument>> => {
  try {
    const id = generateId();
    const completeDocument: StormDocument = {
      ...document,
      id,
    };

    // Get existing documents
    const existingDocuments = await getStormDocuments();
    const updatedDocuments = [...existingDocuments.data, completeDocument];

    // Save to storage
    await AsyncStorage.setItem(
      STORAGE_KEYS.STORM_DOCUMENTS,
      JSON.stringify(updatedDocuments),
    );

    return {
      data: completeDocument,
      success: true,
      message: 'Storm document saved successfully',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error saving storm document:', error);
    return {
      data: {} as StormDocument,
      success: false,
      message: 'Failed to save storm document',
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Get all storm documents from local storage
 */
export const getStormDocuments = async (): Promise<ApiResponse<StormDocument[]>> => {
  try {
    const documentsJson = await AsyncStorage.getItem(STORAGE_KEYS.STORM_DOCUMENTS);
    
    if (!documentsJson) {
      return {
        data: [],
        success: true,
        message: 'No storm documents found',
        timestamp: new Date().toISOString(),
      };
    }

    const documents = JSON.parse(documentsJson) as StormDocument[];
    
    return {
      data: documents,
      success: true,
      message: 'Storm documents retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting storm documents:', error);
    return {
      data: [],
      success: false,
      message: 'Failed to retrieve storm documents',
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Get a specific storm document by ID
 */
export const getStormDocumentById = async (
  id: string,
): Promise<ApiResponse<StormDocument>> => {
  try {
    const documentsResponse = await getStormDocuments();
    
    if (!documentsResponse.success) {
      return {
        data: {} as StormDocument,
        success: false,
        message: documentsResponse.message,
        timestamp: new Date().toISOString(),
      };
    }

    const document = documentsResponse.data.find((doc) => doc.id === id);
    
    if (!document) {
      return {
        data: {} as StormDocument,
        success: false,
        message: 'Storm document not found',
        timestamp: new Date().toISOString(),
      };
    }

    return {
      data: document,
      success: true,
      message: 'Storm document retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting storm document:', error);
    return {
      data: {} as StormDocument,
      success: false,
      message: 'Failed to retrieve storm document',
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Update an existing storm document
 */
export const updateStormDocument = async (
  id: string,
  updates: Partial<StormDocument>,
): Promise<ApiResponse<StormDocument>> => {
  try {
    const documentsResponse = await getStormDocuments();
    
    if (!documentsResponse.success) {
      return {
        data: {} as StormDocument,
        success: false,
        message: documentsResponse.message,
        timestamp: new Date().toISOString(),
      };
    }

    const documentIndex = documentsResponse.data.findIndex((doc) => doc.id === id);
    
    if (documentIndex === -1) {
      return {
        data: {} as StormDocument,
        success: false,
        message: 'Storm document not found',
        timestamp: new Date().toISOString(),
      };
    }

    const updatedDocument = {
      ...documentsResponse.data[documentIndex],
      ...updates,
      id, // Ensure ID doesn't change
    };

    const updatedDocuments = [...documentsResponse.data];
    updatedDocuments[documentIndex] = updatedDocument;

    await AsyncStorage.setItem(
      STORAGE_KEYS.STORM_DOCUMENTS,
      JSON.stringify(updatedDocuments),
    );

    return {
      data: updatedDocument,
      success: true,
      message: 'Storm document updated successfully',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error updating storm document:', error);
    return {
      data: {} as StormDocument,
      success: false,
      message: 'Failed to update storm document',
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Delete a storm document
 */
export const deleteStormDocument = async (
  id: string,
): Promise<ApiResponse<boolean>> => {
  try {
    const documentsResponse = await getStormDocuments();
    
    if (!documentsResponse.success) {
      return {
        data: false,
        success: false,
        message: documentsResponse.message,
        timestamp: new Date().toISOString(),
      };
    }

    const filteredDocuments = documentsResponse.data.filter((doc) => doc.id !== id);
    
    await AsyncStorage.setItem(
      STORAGE_KEYS.STORM_DOCUMENTS,
      JSON.stringify(filteredDocuments),
    );

    return {
      data: true,
      success: true,
      message: 'Storm document deleted successfully',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error deleting storm document:', error);
    return {
      data: false,
      success: false,
      message: 'Failed to delete storm document',
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Clear all storm documents (for testing/reset)
 */
export const clearAllStormDocuments = async (): Promise<ApiResponse<boolean>> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.STORM_DOCUMENTS);
    
    return {
      data: true,
      success: true,
      message: 'All storm documents cleared',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error clearing storm documents:', error);
    return {
      data: false,
      success: false,
      message: 'Failed to clear storm documents',
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Save app settings
 */
export const saveSettings = async (settings: any): Promise<ApiResponse<boolean>> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    
    return {
      data: true,
      success: true,
      message: 'Settings saved successfully',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error saving settings:', error);
    return {
      data: false,
      success: false,
      message: 'Failed to save settings',
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Get app settings
 */
export const getSettings = async (): Promise<ApiResponse<any>> => {
  try {
    const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    
    if (!settingsJson) {
      return {
        data: {},
        success: true,
        message: 'No settings found',
        timestamp: new Date().toISOString(),
      };
    }

    return {
      data: JSON.parse(settingsJson),
      success: true,
      message: 'Settings retrieved successfully',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting settings:', error);
    return {
      data: {},
      success: false,
      message: 'Failed to retrieve settings',
      timestamp: new Date().toISOString(),
    };
  }
};