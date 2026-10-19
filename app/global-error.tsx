"use client";

import { useEffect } from "react";
import { isChunkLoadError, recoverFromChunkError } from "@/lib/chunk-error";
import { pick, useStoredLang } from "@/components/i18n/slice";
import { errors } from "@/components/i18n/errors";

/**
 * Last-resort boundary: catches failures in the root layout itself, where the
 * normal error page cannot render. Must render its own <html>/<body>.
 *
 * Because it replaces the root layout there is no language provider above it,
 * so it reads the saved language directly.
 *
 * A stale build is the one failure we can fix rather than report, so it
 * reloads instead of asking the visitor to press a button.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const lang = useStoredLang();
  const t = pick(errors, lang);
  const stale = isChunkLoadError(error);

  useEffect(() => {
    if (stale) recoverFromChunkError();
  }, [stale]);

  return (
    <html lang={lang}>
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          color: "#1d1d1f",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "28rem" }}>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 600, letterSpacing: "-0.02em" }}>
            {stale ? t.globalError.staleTitle : t.globalError.title}
          </h1>
          <p style={{ marginTop: "0.75rem", color: "#6e6e73", lineHeight: 1.6 }}>
            {stale ? t.globalError.staleBody : t.globalError.body}
          </p>
          {error.digest && (
            <p style={{ marginTop: "0.75rem", color: "#86868b", fontSize: "0.75rem" }}>
              ref: {error.digest}
            </p>
          )}
          {!stale && (
            <button
              onClick={reset}
              style={{
                marginTop: "1.75rem",
                background: "#0071e3",
                color: "#fff",
                border: 0,
                borderRadius: 999,
                padding: "0.75rem 1.75rem",
                fontSize: "1rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {t.globalError.tryAgain}
            </button>
          )}
        </div>
      </body>
    </html>
  );
}
