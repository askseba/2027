'use client'

import { useState, useEffect } from 'react'

/**
 * Custom hook to monitor network connection status
 * @returns Object containing isOnline status and isChecking status
 * 
 * @example
 * const { isOnline, isChecking } = useNetworkStatus()
 * if (!isOnline) {
 *   toast.error('لا يوجد اتصال بالإنترنت')
 * }
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true)
  const [isChecking, setIsChecking] = useState<boolean>(true)

  useEffect(() => {
    // Check initial status
    setIsOnline(navigator.onLine)
    setIsChecking(false)

    // Handle online event
    const handleOnline = () => {
      setIsOnline(true)
      setIsChecking(false)
    }

    // Handle offline event
    const handleOffline = () => {
      setIsOnline(false)
      setIsChecking(false)
    }

    // Add event listeners
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Cleanup: remove event listeners when component unmounts
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOnline, isChecking }
}
