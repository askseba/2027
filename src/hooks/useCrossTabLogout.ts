'use client'

import { useEffect } from 'react'

export function useCrossTabLogout() {
  useEffect(() => {
    // تحقق من دعم BroadcastChannel
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) {
      return
    }

    const channel = new BroadcastChannel('auth-sync')

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'logout') {
        // إعادة توجيه للصفحة الرئيسية
        window.location.href = '/'
      }
    }

    channel.addEventListener('message', handleMessage)

    return () => {
      channel.removeEventListener('message', handleMessage)
      channel.close()
    }
  }, [])

  const broadcastLogout = () => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) {
      return
    }

    const channel = new BroadcastChannel('auth-sync')
    channel.postMessage({
      type: 'logout',
      timestamp: Date.now()
    })
    channel.close()
  }

  return { broadcastLogout }
}
