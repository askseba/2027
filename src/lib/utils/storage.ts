/**
 * Safe localStorage wrapper functions with error handling
 * Handles QuotaExceededError, SecurityError, and other storage errors gracefully
 */

import logger from '@/lib/logger'

/**
 * Check if localStorage is available
 */
function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

/**
 * Safely get item from localStorage
 * @param key - Storage key
 * @param defaultValue - Default value to return if key doesn't exist or error occurs
 * @returns The stored value or defaultValue
 */
export function getStorageItem(key: string, defaultValue: string = ''): string {
  if (!isStorageAvailable()) {
    logger.warn(`localStorage is not available. Returning default value for key: ${key}`)
    return defaultValue
  }

  try {
    const item = localStorage.getItem(key)
    return item !== null ? item : defaultValue
  } catch (error) {
    if (error instanceof DOMException) {
      if (error.name === 'QuotaExceededError') {
        logger.error(`Storage quota exceeded when getting key: ${key}`, error)
      } else if (error.name === 'SecurityError') {
        logger.error(`Security error when getting key: ${key}`, error)
      } else {
        logger.error(`Error getting storage item for key: ${key}`, error)
      }
    } else {
      logger.error(`Unexpected error getting storage item for key: ${key}`, error)
    }
    return defaultValue
  }
}

/**
 * Safely set item in localStorage
 * @param key - Storage key
 * @param value - Value to store
 * @returns true if successful, false otherwise
 */
export function setStorageItem(key: string, value: string): boolean {
  if (!isStorageAvailable()) {
    logger.warn(`localStorage is not available. Cannot set key: ${key}`)
    return false
  }

  try {
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    if (error instanceof DOMException) {
      if (error.name === 'QuotaExceededError') {
        logger.error(`Storage quota exceeded when setting key: ${key}. Value size: ${value.length} bytes`, error)
        // Try to clear old data or notify user
        // You could implement a cleanup strategy here
      } else if (error.name === 'SecurityError') {
        logger.error(`Security error when setting key: ${key}`, error)
      } else {
        logger.error(`Error setting storage item for key: ${key}`, error)
      }
    } else {
      logger.error(`Unexpected error setting storage item for key: ${key}`, error)
    }
    return false
  }
}

/**
 * Safely remove item from localStorage
 * @param key - Storage key to remove
 * @returns true if successful, false otherwise
 */
export function removeStorageItem(key: string): boolean {
  if (!isStorageAvailable()) {
    logger.warn(`localStorage is not available. Cannot remove key: ${key}`)
    return false
  }

  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    if (error instanceof DOMException) {
      if (error.name === 'SecurityError') {
        logger.error(`Security error when removing key: ${key}`, error)
      } else {
        logger.error(`Error removing storage item for key: ${key}`, error)
      }
    } else {
      logger.error(`Unexpected error removing storage item for key: ${key}`, error)
    }
    return false
  }
}

/**
 * Safely clear all items from localStorage
 * @returns true if successful, false otherwise
 */
export function clearStorage(): boolean {
  if (!isStorageAvailable()) {
    logger.warn('localStorage is not available. Cannot clear storage')
    return false
  }

  try {
    localStorage.clear()
    return true
  } catch (error) {
    if (error instanceof DOMException) {
      if (error.name === 'SecurityError') {
        logger.error('Security error when clearing storage', error)
      } else {
        logger.error('Error clearing storage', error)
      }
    } else {
      logger.error('Unexpected error clearing storage', error)
    }
    return false
  }
}

/**
 * Safely get JSON item from localStorage
 * @param key - Storage key
 * @param defaultValue - Default value to return if key doesn't exist or error occurs
 * @returns The parsed JSON value or defaultValue
 */
export function getStorageJSON<T>(key: string, defaultValue: T): T {
  const item = getStorageItem(key, '')
  
  if (!item) {
    return defaultValue
  }

  try {
    return JSON.parse(item) as T
  } catch (error) {
    logger.error(`Error parsing JSON from storage for key: ${key}`, error)
    return defaultValue
  }
}

/**
 * Safely set JSON item in localStorage
 * @param key - Storage key
 * @param value - Value to store (will be JSON stringified)
 * @returns true if successful, false otherwise
 */
export function setStorageJSON<T>(key: string, value: T): boolean {
  try {
    const jsonString = JSON.stringify(value)
    return setStorageItem(key, jsonString)
  } catch (error) {
    logger.error(`Error stringifying JSON for storage key: ${key}`, error)
    return false
  }
}

/**
 * Check if a key exists in localStorage
 * @param key - Storage key to check
 * @returns true if key exists, false otherwise
 */
export function hasStorageItem(key: string): boolean {
  if (!isStorageAvailable()) {
    return false
  }

  try {
    return localStorage.getItem(key) !== null
  } catch (error) {
    logger.error(`Error checking storage item for key: ${key}`, error)
    return false
  }
}
