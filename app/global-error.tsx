"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

// Last-resort boundary for errors in the root layout. Must render its own <html>.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="uk">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: 24, background: "#060605", color: "#f4f5f6" }}>
        <h1 style={{ fontSize: 20 }}>Щось пішло не так / Something went wrong</h1>
        <button
          type="button"
          onClick={reset}
          style={{ marginTop: 16, padding: "10px 16px", borderRadius: 12 }}>
          Спробувати ще раз / Try again
        </button>
      </body>
    </html>
  );
}
