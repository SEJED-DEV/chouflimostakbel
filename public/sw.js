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

const CACHE_VERSION = "v2";
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

// Lets the page ask a waiting worker to take over, so a first visit can
// become eligible for install without waiting for a reload.
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
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

/* ------------------------------------------------------------------ *
 * Update notifications
 * ------------------------------------------------------------------ *
 * One push is sent for a release, carrying the title and body in all three
 * languages. The worker picks the one matching the reader's saved language,
 * so a single message reaches every reader in their own language.
 */

const LANG_KEY = "cmb-lang";

function currentLang() {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored === "fr" || stored === "ar") return stored;
  } catch {
    /* some browsers do not expose localStorage to workers */
  }
  return "en";
}

/** Accepts either one string or one string per language. */
function localised(value, lang) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    if (typeof value[lang] === "string") return value[lang];
    if (typeof value.en === "string") return value.en;
    const first = Object.values(value).find((v) => typeof v === "string");
    if (first) return first;
  }
  return "";
}

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    /* a malformed payload should not stop the notification */
  }

  const lang = currentLang();
  const title = localised(data.title, lang) || "Choufli Mosta9bel";
  const body = localised(data.body, lang);
  const url = typeof data.url === "string" ? data.url : "/changelog";

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      // One notification per release: a newer one replaces the older.
      tag: "cmb-update-" + (data.version || "latest"),
      renotify: true,
      data: { url: url },
      vibrate: [40, 30, 40],
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data && event.notification.data.url
    ? event.notification.data.url
    : "/changelog";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Prefer an open tab: opening a second copy of the app is worse
        // than switching to one that is already there.
        for (const client of clientList) {
          if (client.url.indexOf(self.location.origin) === 0 && "focus" in client) {
            if ("navigate" in client) client.navigate(url);
            return client.focus();
          }
        }
        return self.clients.openWindow(url);
      })
  );
});
