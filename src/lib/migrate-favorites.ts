'use client'

import { toast } from 'sonner'
import { getStorageJSON, removeStorageItem } from '@/lib/utils/storage'
import { safeFetch, validateArray } from '@/lib/utils/api-helpers'
import logger from '@/lib/logger'

/**
 * Helper function to add timeout to promises
 */
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Migration timeout')), ms)
    )
  ])
}

/**
 * Internal migration logic with timeout
 */
const performMigration = async (userId: string, guestFavorites: string[]): Promise<void> => {
  // Get existing favorites from API (with timeout)
  const existingResponse = await withTimeout(
    safeFetch<{ success: boolean; data?: string[]; error?: string }>('/api/user/favorites'),
    10000 // 10 seconds timeout
  )

  if (!existingResponse.success || !existingResponse.data) {
    throw new Error(existingResponse.error || 'فشل جلب المفضلات الموجودة')
  }

  const existingFavorites = validateArray<string>(existingResponse.data, 'المفضلات يجب أن تكون مصفوفة')

  // Find favorites that aren't already saved
  const newFavorites = guestFavorites.filter(
    id => !existingFavorites.includes(id)
  )

  if (newFavorites.length === 0) {
    // All favorites already exist, just clear localStorage
    removeStorageItem('guestFavorites')
    
    // Broadcast to other tabs - migration complete
    if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('favorites-sync')
      channel.postMessage({ 
        type: 'favorites-cleared', 
        userId: userId, // ✅ Include userId for user isolation
        action: 'migration-complete',
        timestamp: Date.now()
      })
      channel.close()
    }
    return
  }

  // Add new favorites to database (with timeout for each request)
  const promises = newFavorites.map(perfumeId =>
    withTimeout(
      safeFetch<{ success: boolean; message?: string; error?: string }>('/api/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ perfumeId, action: 'add' })
      }),
      10000 // 10 seconds timeout per request
    ).catch(err => {
      logger.error(`Error adding favorite ${perfumeId}:`, err)
      throw err
    })
  )

  await Promise.all(promises)

  // Clear localStorage after successful migration
  removeStorageItem('guestFavorites')

  // Broadcast to other tabs - migration complete
  if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
    const channel = new BroadcastChannel('favorites-sync')
    channel.postMessage({ 
      type: 'favorites-cleared', 
      userId: userId, // ✅ Include userId for user isolation
      action: 'migration-complete',
      timestamp: Date.now()
    })
    channel.close()
  }

  // Show success toast
  toast.success(`تم حفظ ${newFavorites.length} من مفضلاتك السابقة ♥️`, {
    duration: 8000,
    dismissible: true,
    action: {
      label: 'عرض المفضلة',
      onClick: () => {
        if (typeof window !== 'undefined') {
          window.location.href = '/dashboard?tab=favorites'
        }
      }
    },
    style: { direction: 'rtl', textAlign: 'right' }
  })
}

/**
 * Migration with retry mechanism
 */
const migrateWithRetry = async (userId: string, guestFavorites: string[], retryCount = 0): Promise<boolean> => {
  const MAX_RETRIES = 1 // Retry once

  try {
    await performMigration(userId, guestFavorites)
    return true
  } catch (error) {
    const isTimeout = error instanceof Error && error.message === 'Migration timeout'

    if (isTimeout && retryCount < MAX_RETRIES) {
      toast.error('انتهت مهلة المزامنة. سيتم المحاولة مرة أخرى...', {
        duration: 5000,
        style: { direction: 'rtl', textAlign: 'right' }
      })
      // Wait 1 second before retry
      await new Promise(resolve => setTimeout(resolve, 1000))
      return migrateWithRetry(userId, guestFavorites, retryCount + 1)
    }

    logger.error('Error migrating favorites:', error)
    return false
  }
}

/**
 * Migrates guest favorites from localStorage to database
 * Should be called after successful login
 */
export async function migrateGuestFavorites(userId: string): Promise<void> {
  const guestFavorites = getStorageJSON<string[]>('guestFavorites', [])

  if (guestFavorites.length === 0) return

  // Check network status before attempting migration
  if (typeof window !== 'undefined' && !navigator.onLine) {
    toast.error('لا يوجد اتصال بالإنترنت. سيتم حفظ المفضلات عند عودة الاتصال.', {
      style: { direction: 'rtl', textAlign: 'right' }
    })
    throw new Error('لا يوجد اتصال بالإنترنت')
  }

  const success = await migrateWithRetry(userId, guestFavorites)
  
  if (!success) {
    // Don't clear localStorage on error - user can retry
    // Error already logged in migrateWithRetry
  }
}
