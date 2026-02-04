"use client";

import { useEffect } from "react";
import { isLazyEnabled } from "@/lib/feature-flags";

/**
 * Loads heavy Sentry integrations (Replay, BrowserTracing) via dynamic import.
 * When DEFER_SENTRY_EXTRAS: after 3s. When flag off or DISABLE_LAZY: immediately (original behavior).
 * Core error tracking remains immediate via Sentry.init() in sentry.client.config.ts.
 */
export function SentryLazyExtras() {
  useEffect(() => {
    const defer = isLazyEnabled("DEFER_SENTRY_EXTRAS");
    const load = () =>
      import("@/lib/sentry-lazy").then((m) => m.addSentryLazyIntegrations());

    if (defer) {
      const timer = setTimeout(load, 3000);
      return () => clearTimeout(timer);
    }
    load();
  }, []);

  return null;
}
