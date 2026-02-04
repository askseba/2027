import type { PostHog } from 'posthog-js'

export const posthogClient: { current: PostHog | null } = { current: null }

export function initPostHogSafely() {
  if (typeof window === 'undefined') return
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!apiKey || posthogClient.current) return

  import('posthog-js').then((module) => {
    const posthog = module.default
    posthog.init(apiKey, { api_host: 'https://app.posthog.com', capture_pageview: false })
    posthogClient.current = posthog
    window.dispatchEvent(new CustomEvent('posthog-ready'))
  }).catch((e) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[posthog-client] init failed:', e)
    }
  })
}

export const trackEvent = (event: string, props?: Record<string, unknown>) => {
  posthogClient.current?.capture(event, props)
}

export const pageView = (page: string) => {
  posthogClient.current?.capture('page_view', { page })
}
