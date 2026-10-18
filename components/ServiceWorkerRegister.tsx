"use client";

import { useEffect } from "react";

/**
 * Registers the service worker that backs the PWA.
 *
 * Chrome only fires `beforeinstallprompt` once a service worker is registered
 * AND controlling the page. Registering on `load` means the very first visit
 * is not eligible, so we register as early as we safely can - after hydration
 * so it never competes with first paint, but not deferred to a load event
 * that may already have fired.
 *
 * Skipped in development: a cached bundle fights hot reloading, and dev
 * serves everything un-cached anyway.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    let cancelled = false;

    async function register() {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        // If a worker is already installed but not controlling (because the
        // user just arrived), ask it to take over immediately.
        if (navigator.serviceWorker.controller) return;

        await navigator.serviceWorker.ready;
        if (cancelled) return;
        if (!navigator.serviceWorker.controller) {
          reg.active?.postMessage({ type: "SKIP_WAITING" });
        }
      } catch {
        // Registration failing is not fatal - the site works fine without it.
      }
    }

    const run = () => {
      if (!cancelled) register();
    };

    if (document.readyState === "complete") {
      run();
    } else {
      // Once hydration has painted, but well before `load` fires.
      window.setTimeout(run, 1200);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
