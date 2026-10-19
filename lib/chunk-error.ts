"use client";

/**
 * Recovery from a stale build.
 *
 * When a new deployment replaces the old one, a browser can be holding a
 * document from the previous build. That document asks for chunks named with
 * the old build's hashes; the new server no longer has them, and the dynamic
 * import fails with a ChunkLoadError. The page is then a tab whose HTML has
 * already been replaced under it.
 *
 * The fix is to notice that specific failure and reload once. It is safe
 * because the reload fetches a fresh document, which references chunks that
 * do exist. It is bounded because it refuses to fire twice in quick
 * succession - a genuinely broken deploy would otherwise become a reload loop,
 * which is worse than the error it is replacing.
 */

const LAST_RECOVERY = "cmb-chunk-recovery-at";

/**
 * Long enough that a reload which succeeds clears the window, short enough
 * that a second deploy later in the same session is still recoverable.
 */
const COOLDOWN_MS = 10_000;

/**
 * Recognises the signatures a failed dynamic import produces. They differ by
 * browser: webpack throws a named ChunkLoadError, a module script that fails
 * to parse reports differently again, and a CSS chunk surfaces as a preload
 * failure rather than an import.
 */
export function isChunkLoadError(input: unknown): boolean {
  if (!input) return false;

  const error = input instanceof Error ? input : null;
  const name = error?.name ?? "";

  // A rejection reason is not always an Error: webpack hands back a plain
  // object carrying a message, and some paths hand back a bare string.
  const raw =
    typeof input === "string"
      ? input
      : ((input as { message?: unknown })?.message ?? String(input));

  const message = String(raw);

  return (
    name === "ChunkLoadError" ||
    /ChunkLoadError/i.test(message) ||
    /Loading chunk \d+ failed/i.test(message) ||
    /Failed to fetch dynamically imported module/i.test(message) ||
    /error loading dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message) ||
    /Unable to preload CSS/i.test(message)
  );
}

/**
 * Reloads once to pick up the current build. No-ops if we already reloaded
 * moments ago, which is what stops a broken deploy from looping.
 */
export function recoverFromChunkError(): void {
  if (typeof window === "undefined") return;

  const now = Date.now();
  let last = 0;
  try {
    last = Number(window.sessionStorage.getItem(LAST_RECOVERY) || "0");
  } catch {
    // Storage blocked. Fall through and reload anyway - one unguarded reload is
    // better than showing the visitor a chunk error.
  }

  if (now - last < COOLDOWN_MS) return;

  try {
    window.sessionStorage.setItem(LAST_RECOVERY, String(now));
  } catch {
    /* ignore */
  }

  window.location.reload();
}
