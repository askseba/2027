import { useEffect } from 'react'
import { pageView, trackEvent } from '@/lib/posthog-client'

export const usePageView = (page: string) => {
  useEffect(() => {
    pageView(page)
  }, [page])
}

export const useTrackEvent = (event: string, props?: any) => {
  trackEvent(event, props)
}
