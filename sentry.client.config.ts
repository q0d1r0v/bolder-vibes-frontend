/**
 * Sentry client-side bootstrap. Loaded by the Next.js runtime before any
 * page mounts, so unhandled render errors and rejected promises surface
 * automatically. Fully inert when NEXT_PUBLIC_SENTRY_DSN is empty.
 */
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.0,
  });
}
