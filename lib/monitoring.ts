import * as Sentry from "@sentry/nextjs";

type ErrorContext = Record<string, string | number | boolean | null | undefined>;

/**
 * Report a handled error: logs to the console and sends it to Sentry (no-op without DSN).
 * Use in `catch` blocks that swallow errors so they are not lost. Never put PII in `context`.
 */
export function reportError(error: unknown, message: string, context?: ErrorContext): void {
  console.error(message, error);
  Sentry.captureException(error, { extra: { message, ...context } });
}

/** Report an unexpected state that is not an exception (e.g. invalid AI response). */
export function reportIssue(message: string, context?: ErrorContext): void {
  console.error(message, context ?? "");
  Sentry.captureMessage(message, { level: "warning", extra: context });
}
