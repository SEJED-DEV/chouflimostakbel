"use client";

/**
 * PWA install plumbing, shared across components.
 *
 * The browser fires `beforeinstallprompt` once, very early, and hands over an
 * event we can call later. If a component swallows it privately, no other
 * component can offer installation - so it lives here instead, in a tiny
 * store that any number of buttons can subscribe to.
 */

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferred: BeforeInstallPromptEvent | null = null;
const subscribers = new Set<() => void>();

function notify() {
  subscribers.forEach((fn) => fn());
}

/** True when the site is already running as an installed app. */
export function isInstalled(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

/**
 * iOS Safari has no install API and never fires the prompt event, so it can
 * only be helped with manual Share -> Add to Home Screen steps.
 */
export function isIosSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const iOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (ua.includes("Macintosh") && "ontouchend" in document);
  return iOS && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
}

/** Can we install with one tap, or is it manual-only? */
export function canPromptDirectly(): boolean {
  return !!deferred && !isInstalled();
}

export function subscribe(fn: () => void): () => void {
  subscribers.add(fn);
  return () => {
    subscribers.delete(fn);
  };
}

/** Internal: capture the event as soon as the browser offers it. */
export function capturePrompt(e: BeforeInstallPromptEvent) {
  deferred = e;
  notify();
}

/**
 * Install the app.
 *
 * Prompts natively where that is supported. On iOS - and anywhere else the
 * browser gives us nothing to work with - returns false so the caller can
 * reveal the manual instructions sheet instead.
 */
export async function promptInstall(): Promise<boolean> {
  if (!deferred || isInstalled()) return false;
  const e = deferred;
  deferred = null;
  notify();
  try {
    await e.prompt();
    await e.userChoice;
    return true;
  } catch {
    return false;
  }
}

/** Signals that a manual-instructions sheet should be shown. */
export const INSTALL_SHEET = {
  subscribe(sheet: { show: () => void } | null) {
    sheetListeners.add(sheet);
    return () => {
      sheetListeners.delete(sheet);
    };
  },
  open() {
    sheetListeners.forEach((s) => s?.show());
  },
};

const sheetListeners = new Set<{ show: () => void } | null>();
