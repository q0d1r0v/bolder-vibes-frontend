/**
 * Next.js instrumentation hook. Loads the right Sentry config per
 * runtime. Sentry itself is inert when no DSN is configured.
 */
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  } else if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Re-export `captureRequestError` under the `onRequestError` name Next.js
// expects. The export is only defined when a DSN is wired up — we guard
// so the instrumentation file works in dev / CI without Sentry enabled.
export const onRequestError = Sentry.captureRequestError;
