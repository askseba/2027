/**
 * Client-only: adds heavy Sentry integrations (Replay, BrowserTracing).
 * Loaded via dynamic import from SentryLazyExtras so server bundle never references replayIntegration.
 */
import * as Sentry from "@sentry/nextjs";

export function addSentryLazyIntegrations(): void {
  Sentry.addIntegration(
    Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true })
  );
  Sentry.addIntegration(Sentry.browserTracingIntegration());
}
