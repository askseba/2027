'use client'

import { removeStorageItem } from '@/lib/utils/storage'
import logger from '@/lib/logger'

/**
 * Clears all user-related data from storage
 * Should be called before signOut to ensure no data leaks to next user
 * 
 * This function clears:
 * - sessionStorage (all items including quizData)
 * - localStorage items: quizData, guestFavorites
 */
export function clearAllUserData() {
  // Clear sessionStorage completely to ensure no session data persists
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.clear()
    } catch (error) {
      logger.error('Error clearing sessionStorage:', error)
      try {
        sessionStorage.removeItem('quizData')
      } catch (e) {
        logger.error('Error removing quizData from sessionStorage:', e)
      }
    }
  }

  // Clear localStorage items related to user data
  // We don't use localStorage.clear() to preserve other app settings
  removeStorageItem('quizData')
  removeStorageItem('guestFavorites')
  // Add any other user-specific localStorage items here if needed
}
