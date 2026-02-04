'use client'
import { useEffect } from 'react'
import { initPostHogSafely } from '@/lib/posthog-client'
import { isLazyEnabled } from '@/lib/feature-flags'

export function PostHogDeferInit() {
  useEffect(() => {
    if (isLazyEnabled('DEFER_POSTHOG')) {
      // Defer to idle time
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => initPostHogSafely(), { timeout: 2000 })
      } else {
        setTimeout(() => initPostHogSafely(), 2000)
      }
    } else {
      // When DEFER_POSTHOG is off (e.g. DISABLE_LAZY), init immediately
      initPostHogSafely()
    }
  }, [])
  return null
}
