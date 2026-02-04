'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useQuiz } from '@/contexts/QuizContext'
import { getStorageJSON, setStorageJSON, removeStorageItem } from '@/lib/utils/storage'
import { safeFetch, validateArray } from '@/lib/utils/api-helpers'
import { toast } from 'sonner'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import logger from '@/lib/logger'

// BroadcastChannel for cross-tab synchronization
const FAVORITES_CHANNEL_NAME = 'favorites-sync'

interface FavoritesMessage {
  type: 'favorites-updated' | 'favorites-cleared'
  userId?: string
  favorites?: string[]
  action?: 'add' | 'remove' | 'migration-complete'
  perfumeId?: string
  timestamp?: number
}

/**
 * Custom hook to unify favorites storage between:
 * - localStorage.guestFavorites (for guest users)
 * - QuizContext.step1_liked (for quiz flow)
 * - Database API (for authenticated users)
 * 
 * Automatically syncs changes between localStorage and QuizContext for guest users.
 * For authenticated users, syncs with database API.
 */
export function useFavorites() {
  const { data: session, status } = useSession()
  const { data: quizData, setStep } = useQuiz()
  const { isOnline } = useNetworkStatus()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [authenticatedFavorites, setAuthenticatedFavorites] = useState<string[]>([])
  
  // BroadcastChannel ref for cross-tab synchronization
  const channelRef = useRef<BroadcastChannel | null>(null)
  const isInitialMountRef = useRef(true)

  // Initialize BroadcastChannel
  useEffect(() => {
    // Check if BroadcastChannel is supported
    if (typeof BroadcastChannel !== 'undefined') {
      channelRef.current = new BroadcastChannel(FAVORITES_CHANNEL_NAME)
      
      const channel = channelRef.current
      
      // Listen for messages from other tabs
      const handleMessage = (event: MessageEvent<FavoritesMessage>) => {
        const message = event.data
        
        // Handle favorites-cleared message (migration complete)
        if (message && message.type === 'favorites-cleared') {
          // ✅ FIX: Handle cleared messages with user isolation
          if (status === 'authenticated' && session?.user?.id) {
            // For authenticated users, only process if userId matches or is missing (migration)
            if (message.userId && message.userId !== session.user.id) {
              logger.warn('Ignoring cross-user clear')
              return
            }
            // Migration clear messages may not have userId, allow them for same user context
            // (This is safe because migration only happens after login, so same user)
          } else if (status === 'unauthenticated') {
            // Clear guest favorites in all tabs (only for unauthenticated users)
            removeStorageItem('guestFavorites')
            setStep('step1_liked', [])
          }
          return
        }
        
        // Validate message structure for favorites-updated
        if (!message || message.type !== 'favorites-updated' || !Array.isArray(message.favorites)) {
          return
        }
        
        // Ignore messages from the same user session if authenticated
        if (status === 'authenticated' && session?.user?.id) {
          // ✅ FIX: Reject cross-user OR missing userId for updates
          if (message.type === 'favorites-updated') {
            if (!message.userId || message.userId !== session.user.id) {
              logger.warn('Ignoring invalid userId update', { messageUserId: message.userId, sessionUserId: session.user.id })
              return
            }
          }
          
          // Update authenticated favorites from other tabs
          const validatedFavorites = validateArray<string>(
            message.favorites,
            'المفضلات يجب أن تكون مصفوفة'
          )
          
          // Only update if different to avoid unnecessary re-renders
          if (JSON.stringify(validatedFavorites.sort()) !== JSON.stringify(authenticatedFavorites.sort())) {
            setAuthenticatedFavorites(validatedFavorites)
          }
        } else {
          // For guest users, sync localStorage and QuizContext
          const validatedFavorites = validateArray<string>(
            message.favorites,
            'المفضلات يجب أن تكون مصفوفة'
          )
          
          // Get current state to compare
          const currentGuest = getStorageJSON<string[]>('guestFavorites', [])
          const currentQuiz = quizData.step1_liked || []
          
          // Only update if different to avoid unnecessary updates
          if (JSON.stringify(validatedFavorites.sort()) !== JSON.stringify(currentGuest.sort())) {
            setStorageJSON('guestFavorites', validatedFavorites)
          }
          
          if (JSON.stringify(validatedFavorites.sort()) !== JSON.stringify(currentQuiz.sort())) {
            setStep('step1_liked', validatedFavorites)
          }
        }
      }
      
      channel.addEventListener('message', handleMessage)
      
      // Cleanup
      return () => {
        channel.removeEventListener('message', handleMessage)
        channel.close()
        channelRef.current = null
      }
    }
  }, [status, session?.user?.id, setStep, quizData.step1_liked, authenticatedFavorites])

  // Broadcast favorites update to other tabs
  const broadcastFavoritesUpdate = useCallback((favorites: string[], action?: 'add' | 'remove', perfumeId?: string) => {
    if (channelRef.current && typeof BroadcastChannel !== 'undefined') {
      const message: FavoritesMessage = {
        type: 'favorites-updated',
        userId: session?.user?.id,
        favorites,
        action,
        perfumeId
      }
      channelRef.current.postMessage(message)
    }
  }, [session?.user?.id])

  // Fetch favorites for authenticated users
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      setIsFetching(true)
      safeFetch<{ success: boolean; data?: string[]; error?: string }>('/api/user/favorites')
        .then((response) => {
          if (response.success && response.data) {
            const favorites = validateArray<string>(response.data, 'المفضلات يجب أن تكون مصفوفة')
            setAuthenticatedFavorites(favorites)
          } else {
            setAuthenticatedFavorites([])
            if (response.error) {
              toast.error(response.error)
            }
          }
        })
        .catch((err) => {
          logger.error('Error fetching favorites:', err)
          setAuthenticatedFavorites([])
          const errorMessage = err instanceof Error ? err.message : 'فشل تحميل المفضلات'
          toast.error(errorMessage)
        })
        .finally(() => {
          setIsFetching(false)
        })
    } else {
      setAuthenticatedFavorites([])
    }
  }, [status, session?.user?.id])

  // Get current favorites based on user status
  const getFavorites = useCallback((): string[] => {
    if (status === 'authenticated' && session?.user?.id) {
      // For authenticated users, return fetched favorites
      return authenticatedFavorites
    } else {
      // For guest users, sync between localStorage and QuizContext
      const guestFavorites = getStorageJSON<string[]>('guestFavorites', [])
      const quizLiked = quizData.step1_liked || []
      
      // Merge and deduplicate
      const merged = Array.from(new Set([...guestFavorites, ...quizLiked]))
      
      // Sync both storages if they differ
      if (JSON.stringify(merged.sort()) !== JSON.stringify(guestFavorites.sort())) {
        setStorageJSON('guestFavorites', merged)
      }
      
      if (JSON.stringify(merged.sort()) !== JSON.stringify(quizLiked.sort())) {
        setStep('step1_liked', merged)
      }
      
      return merged
    }
  }, [session, status, quizData.step1_liked, setStep, authenticatedFavorites])

  // Check if a perfume is in favorites
  const isFavorite = useCallback((perfumeId: string): boolean => {
    if (!perfumeId) return false
    const favorites = getFavorites()
    return favorites.includes(perfumeId)
  }, [getFavorites])

  // Add favorite
  const addFavorite = useCallback(async (perfumeId: string): Promise<void> => {
    if (!perfumeId) return
    
    // Check network status for authenticated users
    if (status === 'authenticated' && session?.user?.id && !isOnline) {
      toast.error('لا يوجد اتصال بالإنترنت. يرجى التحقق من اتصالك والمحاولة مرة أخرى.')
      return
    }
    
    setIsLoading(true)
    
    try {
      if (status === 'authenticated' && session?.user?.id) {
        // For authenticated users, save to database
        const response = await safeFetch<{ success: boolean; message?: string; error?: string }>(
          '/api/user/favorites',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ perfumeId, action: 'add' })
          }
        )
        
        if (!response.success) {
          throw new Error(response.error || 'فشل إضافة المفضلة')
        }
        
        // Update local state
        const updatedFavorites = authenticatedFavorites.includes(perfumeId) 
          ? authenticatedFavorites 
          : [...authenticatedFavorites, perfumeId]
        setAuthenticatedFavorites(updatedFavorites)
        
        // Broadcast update to other tabs
        broadcastFavoritesUpdate(updatedFavorites, 'add', perfumeId)
        
        // Also update localStorage for consistency
        const current = getStorageJSON<string[]>('guestFavorites', [])
        if (!current.includes(perfumeId)) {
          setStorageJSON('guestFavorites', [...current, perfumeId])
        }
      } else {
        // For guest users, update both localStorage and QuizContext
        const currentGuest = getStorageJSON<string[]>('guestFavorites', [])
        const currentQuiz = quizData.step1_liked || []
        
        const updatedGuest = currentGuest.includes(perfumeId) 
          ? currentGuest 
          : [...currentGuest, perfumeId]
        
        const updatedQuiz = currentQuiz.includes(perfumeId)
          ? currentQuiz
          : [...currentQuiz, perfumeId]
        
        setStorageJSON('guestFavorites', updatedGuest)
        setStep('step1_liked', updatedQuiz)
        
        // Broadcast update to other tabs
        broadcastFavoritesUpdate(updatedGuest, 'add', perfumeId)
      }
    } catch (error) {
      logger.error('Error adding favorite:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [status, session, quizData.step1_liked, setStep, authenticatedFavorites, broadcastFavoritesUpdate])

  // Remove favorite
  const removeFavorite = useCallback(async (perfumeId: string): Promise<void> => {
    if (!perfumeId) return
    
    // Check network status for authenticated users
    if (status === 'authenticated' && session?.user?.id && !isOnline) {
      toast.error('لا يوجد اتصال بالإنترنت. يرجى التحقق من اتصالك والمحاولة مرة أخرى.')
      return
    }
    
    setIsLoading(true)
    
    try {
      if (status === 'authenticated' && session?.user?.id) {
        // For authenticated users, remove from database
        const response = await safeFetch<{ success: boolean; message?: string; error?: string }>(
          '/api/user/favorites',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ perfumeId, action: 'remove' })
          }
        )
        
        if (!response.success) {
          throw new Error(response.error || 'فشل حذف المفضلة')
        }
        
        // Update local state
        const updatedFavorites = authenticatedFavorites.filter(id => id !== perfumeId)
        setAuthenticatedFavorites(updatedFavorites)
        
        // Broadcast update to other tabs
        broadcastFavoritesUpdate(updatedFavorites, 'remove', perfumeId)
        
        // Also update localStorage for consistency
        const current = getStorageJSON<string[]>('guestFavorites', [])
        const updated = current.filter((id: string) => id !== perfumeId)
        setStorageJSON('guestFavorites', updated)
      } else {
        // For guest users, remove from both localStorage and QuizContext
        const currentGuest = getStorageJSON<string[]>('guestFavorites', [])
        const currentQuiz = quizData.step1_liked || []
        
        const updatedGuest = currentGuest.filter((id: string) => id !== perfumeId)
        const updatedQuiz = currentQuiz.filter((id: string) => id !== perfumeId)
        
        setStorageJSON('guestFavorites', updatedGuest)
        setStep('step1_liked', updatedQuiz)
        
        // Broadcast update to other tabs
        broadcastFavoritesUpdate(updatedGuest, 'remove', perfumeId)
      }
    } catch (error) {
      logger.error('Error removing favorite:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [status, session, quizData.step1_liked, setStep, authenticatedFavorites, broadcastFavoritesUpdate])

  // Toggle favorite (add if not exists, remove if exists)
  const toggleFavorite = useCallback(async (perfumeId: string): Promise<void> => {
    // Check network status for authenticated users
    if (status === 'authenticated' && session?.user?.id && !isOnline) {
      toast.error('لا يوجد اتصال بالإنترنت. يرجى التحقق من اتصالك والمحاولة مرة أخرى.')
      return
    }
    
    if (isFavorite(perfumeId)) {
      await removeFavorite(perfumeId)
    } else {
      await addFavorite(perfumeId)
    }
  }, [isFavorite, addFavorite, removeFavorite, status, session?.user?.id, isOnline])

  // Sync localStorage and QuizContext on mount and when quizData changes
  // Skip on initial mount to avoid unnecessary broadcasts
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false
      return
    }
    
    if (status === 'unauthenticated') {
      const guestFavorites = getStorageJSON<string[]>('guestFavorites', [])
      const quizLiked = quizData.step1_liked || []
      
      // If they differ, sync them
      const merged = Array.from(new Set([...guestFavorites, ...quizLiked]))
      
      if (JSON.stringify(merged.sort()) !== JSON.stringify(guestFavorites.sort())) {
        setStorageJSON('guestFavorites', merged)
      }
      
      if (JSON.stringify(merged.sort()) !== JSON.stringify(quizLiked.sort())) {
        setStep('step1_liked', merged)
      }
    }
  }, [status, quizData.step1_liked, setStep])
  
  // Also listen to storage events as a fallback (for browsers that don't support BroadcastChannel)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Only handle our favorites storage
      if (e.key === 'guestFavorites') {
        // Handle removeItem (e.newValue === null)
        if (e.newValue === null && e.oldValue && status === 'unauthenticated') {
          // Favorites cleared (migration or manual removal)
          setStep('step1_liked', [])
          return
        }
        
        // Handle favorites update (e.newValue exists)
        if (e.newValue) {
          try {
            const newFavorites = JSON.parse(e.newValue)
            if (Array.isArray(newFavorites) && status === 'unauthenticated') {
              // Update QuizContext when localStorage changes from another tab
              setStep('step1_liked', newFavorites)
            }
          } catch (err) {
            logger.error('Error parsing storage event:', err)
          }
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [status, session?.user?.id, setStep])

  return {
    favorites: getFavorites(),
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isLoading: isLoading || isFetching,
    isOnline
  }
}
