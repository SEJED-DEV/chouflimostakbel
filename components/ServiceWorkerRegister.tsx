"use client";

import { useEffect } from "react";

/**
 * Registers the service worker that backs the PWA.
 *
 * Skipped entirely in development - a stale cache is far more annoying than
 * useful while hot reloading, and dev already runs un-cached.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
        // Registration failing is not fatal - the site works fine without it.
      });
    };

    // Register after load so it never competes with first paint.
    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}
