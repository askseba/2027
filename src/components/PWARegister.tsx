'use client'
import { useEffect, useState } from 'react'
import logger from '@/lib/logger'

export function PWARegister() {
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e)

      // Check if already installed
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowInstallBanner(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const handleLoad = () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            logger.info('Service Worker registered:', registration.scope)
          })
          .catch((error) => {
            logger.warn('Service Worker registration failed:', error)
          })
      }

      window.addEventListener('load', handleLoad)

      // Cleanup: remove event listener when component unmounts
      return () => {
        window.removeEventListener('load', handleLoad)
      }
    }
  }, [])

  const handleInstallClick = async () => {
    if (!installPrompt) return

    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice

    if (outcome === 'accepted') {
      setShowInstallBanner(false)
      setInstallPrompt(null)
    }
  }

  const handleDismiss = () => {
    setShowInstallBanner(false)
    // Store dismissal in localStorage to avoid showing again soon
    localStorage.setItem('installPromptDismissed', Date.now().toString())
  }

  return (
    <>
      {showInstallBanner && (
        <div className="fixed bottom-4 inset-x-4 z-50 mx-auto max-w-md">
          <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4 flex items-center gap-3">
            <div className="flex-1">
              <p className="font-semibold">تثبيت Ask Seba</p>
              <p className="text-sm opacity-90">للوصول السريع والاستخدام بدون إنترنت</p>
            </div>
            <button
              onClick={handleInstallClick}
              className="bg-white text-primary px-4 py-2 rounded-md font-medium"
            >
              تثبيت
            </button>
            <button
              onClick={handleDismiss}
              className="text-white/80 hover:text-white"
              aria-label="إغلاق"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}
