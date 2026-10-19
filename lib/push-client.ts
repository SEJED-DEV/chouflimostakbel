"use client";

/**
 * The browser side of web push.
 *
 * The public key is inlined at build time, so the bundle has to be rebuilt
 * after the key changes. Everything else here talks to the browser.
 */

export const PUSH_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  // Built from an explicit ArrayBuffer: the push API wants a plain one, and
  // a Uint8Array over a shared buffer is not accepted.
  const output = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

/** True when this browser can do push at all. */
export function pushSupported(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window &&
    Boolean(PUSH_PUBLIC_KEY)
  );
}

/** iOS only delivers web push to an app added to the Home Screen. */
export function iosWithoutApp(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const iOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (!iOS) return false;
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true;
  return !standalone;
}

/** The subscription this device already has, if any. */
export async function currentSubscription(): Promise<PushSubscription | null> {
  if (!pushSupported()) return null;
  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
}

/**
 * Asks for permission and subscribes.
 *
 * Returns the subscription, or null if the reader refused. The refusal is
 * the browser's, and it is permanent for the origin - the caller decides
 * what to do about it.
 */
export async function enablePush(): Promise<PushSubscription | null> {
  if (!pushSupported()) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(PUSH_PUBLIC_KEY),
  });

  const res = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription.toJSON()),
  });

  if (!res.ok) throw new Error("the subscription could not be stored");

  return subscription;
}

/** Turns it off, and deletes the stored token. */
export async function disablePush(): Promise<void> {
  if (!pushSupported()) return;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;

  // Delete it server side first: an unsubscribe alone would leave the record
  // behind, still holding a token we could push to.
  await fetch("/api/push/subscribe", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint: subscription.endpoint }),
  }).catch(() => undefined);

  await subscription.unsubscribe();
}
