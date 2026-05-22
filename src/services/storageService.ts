/**
 * Storage Service
 * Handles local data persistence using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraPhoto } from './cameraService';
import { StormType } from '../types';

export interface StormDocument {
  id: string;
  stormType: StormType;
  weatherCondition: string;
  notes: string;
  location: string;
  photo: CameraPhoto;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    intensity?: number; // 1-10 scale
    duration?: number; // minutes
    damageReported?: boolean;
    safetyConcerns?: string[];
    tags?: string[];
  };
}

export interface StorageStats {
  totalDocuments: number;
  byStormType: Record<StormType, number>;
  byWeatherCondition: Record<string, number>;
  byDate: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  totalPhotos: number;
  storageSize?: number; // in bytes
}

export interface FilterOptions {
  stormType?: StormType | 'all';
  weatherCondition?: string | 'all';
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchQuery?: string;
  sortBy?: 'date' | 'type' | 'location' | 'intensity';
  sortOrder?: 'asc' | 'desc';
}

// Storage keys
const STORAGE_KEYS = {
  STORM_DOCUMENTS: '@StormChaser:stormDocuments',
  STORAGE_STATS: '@StormChaser:storageStats',
  APP_SETTINGS: '@StormChaser:appSettings',
  LAST_SYNC: '@StormChaser:lastSync',
};

/**
 * Generate a unique ID for documents
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Save a storm document
 */
export const saveStormDocument = async (
  document: Omit<StormDocument, 'id' | 'createdAt' | 'updatedAt'>
): Promise<StormDocument> => {
  try {
    const now = new Date().toISOString();
    const newDocument: StormDocument = {
      ...document,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    // Get existing documents
    const existingDocuments = await getStormDocuments();
    
    // Add new document
    const updatedDocuments = [...existingDocuments, newDocument];
    
    // Save to storage
    await AsyncStorage.setItem(
      STORAGE_KEYS.STORM_DOCUMENTS,
      JSON.stringify(updatedDocuments)
    );

    // Update storage stats
    await updateStorageStats();

    return newDocument;
  } catch (error) {
    console.error('Error saving storm document:', error);
    throw new Error('Failed to save storm document');
  }
};

/**
 * Get all storm documents
 */
export const getStormDocuments = async (): Promise<StormDocument[]> => {
  try {
    const documentsJson = await AsyncStorage.getItem(STORAGE_KEYS.STORM_DOCUMENTS);
    
    if (!documentsJson) {
      return [];
    }

    return JSON.parse(documentsJson);
  } catch (error) {
    console.error('Error getting storm documents:', error);
    return [];
  }
};

/**
 * Get filtered storm documents
 */
export const getFilteredStormDocuments = async (
  filterOptions: FilterOptions = {}
): Promise<StormDocument[]> => {
  try {
    const allDocuments = await getStormDocuments();
    
    return allDocuments.filter((doc) => {
      // Filter by storm type
      if (filterOptions.stormType && filterOptions.stormType !== 'all') {
        if (doc.stormType !== filterOptions.stormType) {
          return false;
        }
      }

      // Filter by weather condition
      if (filterOptions.weatherCondition && filterOptions.weatherCondition !== 'all') {
        if (doc.weatherCondition !== filterOptions.weatherCondition) {
          return false;
        }
      }

      // Filter by date range
      if (filterOptions.dateRange) {
        const docDate = new Date(doc.createdAt);
        if (
          docDate < filterOptions.dateRange.start ||
          docDate > filterOptions.dateRange.end
        ) {
          return false;
        }
      }

      // Filter by search query
      if (filterOptions.searchQuery) {
        const query = filterOptions.searchQuery.toLowerCase();
        const searchableText = [
          doc.notes,
          doc.location,
          doc.stormType,
          doc.weatherCondition,
          ...(doc.metadata?.tags || []),
        ].join(' ').toLowerCase();

        if (!searchableText.includes(query)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Sort documents
      if (!filterOptions.sortBy) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Default: newest first
      }

      let aValue: any;
      let bValue: any;

      switch (filterOptions.sortBy) {
        case 'date':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'type':
          aValue = a.stormType;
          bValue = b.stormType;
          break;
        case 'location':
          aValue = a.location;
          bValue = b.location;
          break;
        case 'intensity':
          aValue = a.metadata?.intensity || 0;
          bValue = b.metadata?.intensity || 0;
          break;
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }

      const order = filterOptions.sortOrder === 'asc' ? 1 : -1;
      
      if (aValue < bValue) return -1 * order;
      if (aValue > bValue) return 1 * order;
      return 0;
    });
  } catch (error) {
    console.error('Error filtering storm documents:', error);
    return [];
  }
};

/**
 * Get a single storm document by ID
 */
export const getStormDocumentById = async (id: string): Promise<StormDocument | null> => {
  try {
    const documents = await getStormDocuments();
    return documents.find(doc => doc.id === id) || null;
  } catch (error) {
    console.error('Error getting storm document by ID:', error);
    return null;
  }
};

/**
 * Update a storm document
 */
export const updateStormDocument = async (
  id: string,
  updates: Partial<Omit<StormDocument, 'id' | 'createdAt'>>
): Promise<StormDocument | null> => {
  try {
    const documents = await getStormDocuments();
    const documentIndex = documents.findIndex(doc => doc.id === id);

    if (documentIndex === -1) {
      return null;
    }

    const updatedDocument: StormDocument = {
      ...documents[documentIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    documents[documentIndex] = updatedDocument;

    await AsyncStorage.setItem(
      STORAGE_KEYS.STORM_DOCUMENTS,
      JSON.stringify(documents)
    );

    // Update storage stats
    await updateStorageStats();

    return updatedDocument;
  } catch (error) {
    console.error('Error updating storm document:', error);
    throw new Error('Failed to update storm document');
  }
};

/**
 * Delete a storm document
 */
export const deleteStormDocument = async (id: string): Promise<boolean> => {
  try {
    const documents = await getStormDocuments();
    const filteredDocuments = documents.filter(doc => doc.id !== id);

    if (filteredDocuments.length === documents.length) {
      return false; // Document not found
    }

    await AsyncStorage.setItem(
      STORAGE_KEYS.STORM_DOCUMENTS,
      JSON.stringify(filteredDocuments)
    );

    // Update storage stats
    await updateStorageStats();

    return true;
  } catch (error) {
    console.error('Error deleting storm document:', error);
    throw new Error('Failed to delete storm document');
  }
};

/**
 * Delete multiple storm documents
 */
export const deleteMultipleStormDocuments = async (ids: string[]): Promise<number> => {
  try {
    const documents = await getStormDocuments();
    const initialCount = documents.length;
    
    const filteredDocuments = documents.filter(doc => !ids.includes(doc.id));
    const deletedCount = initialCount - filteredDocuments.length;

    if (deletedCount > 0) {
      await AsyncStorage.setItem(
        STORAGE_KEYS.STORM_DOCUMENTS,
        JSON.stringify(filteredDocuments)
      );

      // Update storage stats
      await updateStorageStats();
    }

    return deletedCount;
  } catch (error) {
    console.error('Error deleting multiple storm documents:', error);
    throw new Error('Failed to delete storm documents');
  }
};

/**
 * Clear all storm documents
 */
export const clearAllStormDocuments = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.STORM_DOCUMENTS);
    await updateStorageStats();
  } catch (error) {
    console.error('Error clearing all storm documents:', error);
    throw new Error('Failed to clear storm documents');
  }
};

/**
 * Get storage statistics
 */
export const getStorageStats = async (): Promise<StorageStats> => {
  try {
    const statsJson = await AsyncStorage.getItem(STORAGE_KEYS.STORAGE_STATS);
    
    if (statsJson) {
      return JSON.parse(statsJson);
    }

    // Generate initial stats
    return await updateStorageStats();
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return getDefaultStorageStats();
  }
};

/**
 * Update storage statistics
 */
export const updateStorageStats = async (): Promise<StorageStats> => {
  try {
    const documents = await getStormDocuments();
    
    const stats: StorageStats = {
      totalDocuments: documents.length,
      byStormType: {} as Record<StormType, number>,
      byWeatherCondition: {},
      byDate: {
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
      },
      totalPhotos: documents.length,
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    documents.forEach(doc => {
      // Count by storm type
      stats.byStormType[doc.stormType] = (stats.byStormType[doc.stormType] || 0) + 1;

      // Count by weather condition
      stats.byWeatherCondition[doc.weatherCondition] = 
        (stats.byWeatherCondition[doc.weatherCondition] || 0) + 1;

      // Count by date
      const docDate = new Date(doc.createdAt);
      
      if (docDate >= today) {
        stats.byDate.today++;
      }
      
      if (docDate >= weekAgo) {
        stats.byDate.thisWeek++;
      }
      
      if (docDate >= monthAgo) {
        stats.byDate.thisMonth++;
      }
    });

    // Calculate storage size (approximate)
    const documentsJson = JSON.stringify(documents);
    stats.storageSize = new Blob([documentsJson]).size;

    // Save stats
    await AsyncStorage.setItem(
      STORAGE_KEYS.STORAGE_STATS,
      JSON.stringify(stats)
    );

    return stats;
  } catch (error) {
    console.error('Error updating storage stats:', error);
    return getDefaultStorageStats();
  }
};

/**
 * Get default storage stats
 */
const getDefaultStorageStats = (): StorageStats => {
  return {
    totalDocuments: 0,
    byStormType: {} as Record<StormType, number>,
    byWeatherCondition: {},
    byDate: {
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
    },
    totalPhotos: 0,
    storageSize: 0,
  };
};

/**
 * Export data as JSON
 */
export const exportData = async (): Promise<string> => {
  try {
    const documents = await getStormDocuments();
    const stats = await getStorageStats();
    
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      documentCount: documents.length,
      documents,
      statistics: stats,
    };

    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('Failed to export data');
  }
};

/**
 * Import data from JSON
 */
export const importData = async (jsonData: string): Promise<{
  importedCount: number;
  totalCount: number;
}> => {
  try {
    const data = JSON.parse(jsonData);
    
    if (!data.documents || !Array.isArray(data.documents)) {
      throw new Error('Invalid data format');
    }

    const existingDocuments = await getStormDocuments();
    const newDocuments = data.documents.filter((newDoc: StormDocument) => {
      return !existingDocuments.some(existingDoc => existingDoc.id === newDoc.id);
    });

    const allDocuments = [...existingDocuments, ...newDocuments];

    await AsyncStorage.setItem(
      STORAGE_KEYS.STORM_DOCUMENTS,
      JSON.stringify(allDocuments)
    );

    await updateStorageStats();

    return {
      importedCount: newDocuments.length,
      totalCount: allDocuments.length,
    };
  } catch (error) {
    console.error('Error importing data:', error);
    throw new Error('Failed to import data');
  }
};

/**
 * Search storm documents
 */
export const searchStormDocuments = async (
  query: string,
  limit: number = 50
): Promise<StormDocument[]> => {
  try {
    const documents = await getStormDocuments();
    const searchQuery = query.toLowerCase();

    return documents
      .filter(doc => {
        const searchableText = [
          doc.notes,
          doc.location,
          doc.stormType,
          doc.weatherCondition,
          ...(doc.metadata?.tags || []),
        ].join(' ').toLowerCase();

        return searchableText.includes(searchQuery);
      })
      .slice(0, limit);
  } catch (error) {
    console.error('Error searching storm documents:', error);
    return [];
  }
};

/**
 * Get document count by date range
 */
export const getDocumentCountByDateRange = async (
  startDate: Date,
  endDate: Date
): Promise<number> => {
  try {
    const documents = await getStormDocuments();
    
    return documents.filter(doc => {
      const docDate = new Date(doc.createdAt);
      return docDate >= startDate && docDate <= endDate;
    }).length;
  } catch (error) {
    console.error('Error getting document count by date range:', error);
    return 0;
  }
};

/**
 * Backup data to a file (simulated)
 */
export const backupData = async (): Promise<{
  success: boolean;
  backupSize?: number;
  timestamp?: string;
}> => {
  try {
    const exportJson = await exportData();
    const backupSize = new Blob([exportJson]).size;
    const timestamp = new Date().toISOString();

    // In a real implementation, this would save to a file
    // For now, we'll just simulate the backup
    console.log('Backup created:', { backupSize, timestamp });

    return {
      success: true,
      backupSize,
      timestamp,
    };
  } catch (error) {
    console.error('Error backing up data:', error);
    return {
      success: false,
    };
  }
};

/**
 * Check storage health
 */
export const checkStorageHealth = async (): Promise<{
  isHealthy: boolean;
  issues: string[];
  documentCount: number;
  storageSize?: number;
}> => {
  try {
    const documents = await getStormDocuments();
    const stats = await getStorageStats();
    
    const issues: string[] = [];

    // Check for corrupted documents
    const corruptedDocs = documents.filter(doc => 
      !doc.id || !doc.createdAt || !doc.photo
    );
    
    if (corruptedDocs.length > 0) {
      issues.push(`Found ${corruptedDocs.length} potentially corrupted documents`);
    }

    // Check storage size (warning if > 10MB)
    if (stats.storageSize && stats.storageSize > 10 * 1024 * 1024) {
      issues.push('Storage size is getting large (>10MB)');
    }

    return {
      isHealthy: issues.length === 0,
      issues,
      documentCount: documents.length,
      storageSize: stats.storageSize,
    };
  } catch (error) {
    console.error('Error checking storage health:', error);
    return {
      isHealthy: false,
      issues: ['Storage health check failed'],
      documentCount: 0,
    };
  }
};