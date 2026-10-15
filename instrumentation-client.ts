import * as Sentry from "@sentry/nextjs";
import { sentryOptions } from "./sentry.shared";

Sentry.init({
  ...sentryOptions,
  // Errors only on the client; no session replay (privacy, bundle size).
  integrations: [],
  ignoreErrors: [
    // Benign browser noise.
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
