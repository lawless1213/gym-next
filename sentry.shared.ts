// Options shared by client, server and edge Sentry configs.
// Sentry is a no-op unless NEXT_PUBLIC_SENTRY_DSN is set (local dev, CI and e2e run without it).
export const sentryOptions = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
  // Performance: sample a small share of requests; raise if you need more traces.
  tracesSampleRate: 0.1,
  // Privacy: no IPs/cookies/headers. We attach only the Firebase uid (see AuthProvider).
  sendDefaultPii: false,
};
