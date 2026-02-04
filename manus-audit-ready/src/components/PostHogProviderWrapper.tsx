'use client'
import { useState, useEffect } from 'react'
import { PostHogProvider } from 'posthog-js/react'
import { posthogClient } from '@/lib/posthog-client'
import { PostHogDeferInit } from '@/components/PostHogDeferInit'

/**
 * Wraps children with PostHogProvider only when client is ready.
 * PostHogProvider does not safely accept client={null}, so we avoid passing null.
 */
export function PostHogProviderWrapper({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<typeof posthogClient.current>(posthogClient.current)

  useEffect(() => {
    if (posthogClient.current) setClient(posthogClient.current)
    const onReady = () => setClient(posthogClient.current)
    window.addEventListener('posthog-ready', onReady)
    return () => window.removeEventListener('posthog-ready', onReady)
  }, [])

  if (!client) {
    return (
      <>
        {children}
        <PostHogDeferInit />
      </>
    )
  }
  return (
    <PostHogProvider client={client}>
      {children}
      <PostHogDeferInit />
    </PostHogProvider>
  )
}
