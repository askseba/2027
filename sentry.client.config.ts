import * as Sentry from "@sentry/nextjs";

// CRITICAL: Init runs immediately - never wrap in setTimeout/useEffect (needed for hydration/early errors)
// Integrations: empty here. Replay/BrowserTracing added via addSentryLazyIntegrations (see src/lib/sentry-lazy.ts)
// when loaded on client - either immediately (flag off) or after 3s (flag on).
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.2,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [],
});

// Make available for ErrorBoundary
if (typeof window !== "undefined") {
  (window as any).Sentry = Sentry;
}
