/**
 * A small in-memory rate limit.
 *
 * Per process, and it resets when the process restarts. That is enough to
 * slow a script down; it is not a security boundary, and a shared store would
 * be needed for that.
 */
const hits = new Map<string, number[]>();

/**
 * Records a hit and says whether the caller has gone over the limit.
 *
 * Returns true when the caller is over it - in which case the hit is NOT
 * recorded, so a caller that keeps trying does not extend its own window.
 */
export function tooMany(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= max) {
    hits.set(key, recent);
    return true;
  }

  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing without bound on a long-running server.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (!times.some((t) => now - t < windowMs)) hits.delete(k);
    }
  }

  return false;
}

/** Identifies the caller well enough to rate limit them. */
export function callerKey(request: Request, scope: string): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const agent = request.headers.get("user-agent") ?? "";
  return `${scope}:${ip}|${agent.slice(0, 40)}`;
}
