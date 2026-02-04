'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { WifiOff, Wifi } from 'lucide-react'

/**
 * Component to display network status toast notifications
 * Shows warning when offline, success when back online
 */
export function NetworkStatusToast() {
  const { isOnline, isChecking } = useNetworkStatus()
  const toastIdRef = useRef<string | number | null>(null)

  useEffect(() => {
    // Don't show toast while checking initial status
    if (isChecking) return

    if (!isOnline) {
      // Show offline toast
      const id = toast.error('لا يوجد اتصال بالإنترنت', {
        description: 'بعض الميزات قد لا تعمل بشكل صحيح. يرجى التحقق من اتصالك بالإنترنت.',
        duration: Infinity, // Keep toast visible until connection is restored
        icon: <WifiOff className="w-5 h-5" />,
        action: {
          label: 'حسناً',
          onClick: () => toast.dismiss(id)
        }
      })
      toastIdRef.current = id
    } else {
      // Dismiss offline toast if exists and show online notification
      if (toastIdRef.current !== null) {
        toast.dismiss(toastIdRef.current)
        toast.success('تم استعادة الاتصال بالإنترنت', {
          description: 'يمكنك الآن استخدام جميع الميزات.',
          icon: <Wifi className="w-5 h-5" />,
          duration: 3000
        })
        toastIdRef.current = null
      }
    }
  }, [isOnline, isChecking])

  // Cleanup: dismiss toast on unmount
  useEffect(() => {
    return () => {
      if (toastIdRef.current !== null) {
        toast.dismiss(toastIdRef.current)
      }
    }
  }, [])

  return null
}
