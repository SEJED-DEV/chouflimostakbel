/**
 * Test helpers for the first-visit modals.
 *
 * The language sheet, the welcome sheet and the install prompt all persist
 * decisions in localStorage. During development that makes them impossible to
 * re-trigger by hand, so this exposes a small console API:
 *
 *   cmbResetModals()     forget everything - both sheets show again
 *   cmbResetWelcome()    only the welcome sheet
 *   cmbResetInstall()    only the install prompt
 *   cmbResetLanguage()   only the language sheet
 *
 * Development only. It is a no-op in production builds, and it installs
 * itself on the client - there is no `window` on the server, and touching one
 * during render throws away the page being rendered.
 */
"use client";

import { useEffect } from "react";

const KEYS = {
  language: "cmb-lang",
  welcome: "cmb-welcome-seen",
  install: "cmb-install-dismissed",
} as const;

export default function DevModalReset() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;

    const clear = (...keys: (keyof typeof KEYS)[]) => {
      try {
        keys.forEach((k) => window.localStorage.removeItem(KEYS[k]));
        console.log("[cmb] cleared:", keys.join(", "));
      } catch {
        console.warn("[cmb] localStorage unavailable");
      }
    };

    const w = window as unknown as Record<string, unknown>;
    w.cmbResetModals = () => clear("language", "welcome", "install");
    w.cmbResetWelcome = () => clear("welcome");
    w.cmbResetInstall = () => clear("install");
    w.cmbResetLanguage = () => clear("language");

    return () => {
      [
        "cmbResetModals",
        "cmbResetWelcome",
        "cmbResetInstall",
        "cmbResetLanguage",
      ].forEach((k) => delete w[k]);
    };
  }, []);

  return null;
}
