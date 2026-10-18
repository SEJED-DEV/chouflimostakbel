"use client";

/**
 * Last-resort boundary: catches failures in the root layout itself, where the
 * normal error page cannot render. Must render its own <html>/<body>.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
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
            Something went sideways.
          </h1>
          <p style={{ marginTop: "0.75rem", color: "#6e6e73", lineHeight: 1.6 }}>
            The site failed to load properly. Try again, or reload the page.
          </p>
          {error.digest && (
            <p style={{ marginTop: "0.75rem", color: "#86868b", fontSize: "0.75rem" }}>
              ref: {error.digest}
            </p>
          )}
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
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
