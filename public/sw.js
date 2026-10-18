/*
 * Service worker for Choufli Mosta9bel.
 *
 * Deliberately conservative. The one rule that matters:
 *   NEVER serve a cached HTML document.
 *
 * Navigation requests are network-first and fall back to cache only when the
 * device is genuinely offline. Build-hashed assets under /_next/static are
 * immutable, so those are safe to serve cache-first.
 *
 * Bump CACHE_VERSION to invalidate everything on the next visit.
 */

const CACHE_VERSION = "v1";
const STATIC_CACHE = `cmb-static-${CACHE_VERSION}`;
const PAGES_CACHE = `cmb-pages-${CACHE_VERSION}`;
const OFFLINE_URL = "/offline.html";

/** Assets we want available immediately on first visit. */
const PRECACHE = [
  OFFLINE_URL,
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/favicon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== STATIC_CACHE && k !== PAGES_CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

/** Content-hashed build output - safe to cache forever. */
function isImmutableAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    /\.(?:png|jpg|jpeg|svg|webp|avif|woff2?|ttf|ico)$/i.test(url.pathname)
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GETs; let forms, prefetches and cross-origin calls pass through.
  if (request.method !== "GET") return;
  if (new URL(request.url).origin !== self.location.origin) return;
  if (request.cache === "only-if-cached" && request.mode !== "same-origin") return;

  // ---- Navigations: network-first, never a stale document ----
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful, same-origin HTML.
          if (response && response.ok && response.type === "basic") {
            const copy = response.clone();
            caches.open(PAGES_CACHE).then((c) => c.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // ---- Immutable assets: cache-first ----
  if (isImmutableAsset(new URL(request.url))) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response && response.ok && response.type === "basic") {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(request, copy));
          }
          return response;
        });
      })
    );
  }
});
