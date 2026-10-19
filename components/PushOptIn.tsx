"use client";

import { useEffect, useState } from "react";
import { Bell } from "@phosphor-icons/react/dist/ssr/Bell";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { useSlice } from "@/components/i18n/slice";
import { push as pushCopy } from "@/components/i18n/push";

/**
 * Lets a reader turn on update alerts.
 *
 * Push is a device token, not an account: no email address is asked for and
 * nothing is tracked. The reader can turn it off again, and turning it off
 * deletes the stored subscription immediately.
 *
 * The prompt is never shown on page load. Asking unprompted is how a browser
 * ends up permanently refusing, so it appears only where someone is already
 * reading about releases.
 */

type State =
  | "checking"
  | "unsupported"
  | "off"
  | "on"
  | "denied"
  | "error";

/** The public key is inlined at build time. Empty means push is not set up. */
const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

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

/** iOS only delivers web push to an app added to the Home Screen. */
function iosWithoutApp(): boolean {
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

export default function PushOptIn({ className = "" }: { className?: string }) {
  const t = useSlice(pushCopy);
  const [state, setState] = useState<State>("checking");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const supported =
        typeof window !== "undefined" &&
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window &&
        Boolean(PUBLIC_KEY);

      if (!supported || iosWithoutApp()) {
        if (!cancelled) setState("unsupported");
        return;
      }

      if (Notification.permission === "denied") {
        if (!cancelled) setState("denied");
        return;
      }

      try {
        const registration = await navigator.serviceWorker.ready;
        const existing = await registration.pushManager.getSubscription();
        if (!cancelled) setState(existing ? "on" : "off");
      } catch {
        if (!cancelled) setState("off");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function enable() {
    if (busy) return;
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState(permission === "denied" ? "denied" : "off");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY),
      });

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });

      setState(res.ok ? "on" : "error");
    } catch {
      setState("error");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    if (busy) return;
    setBusy(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        // Delete it server side first: an unsubscribe alone would leave the
        // record behind, still holding a token we could push to.
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        }).catch(() => undefined);
        await subscription.unsubscribe();
      }
      setState("off");
    } catch {
      setState("error");
    } finally {
      setBusy(false);
    }
  }

  if (state === "checking" || state === "unsupported") return null;

  if (state === "on") {
    return (
      <div
        className={`inline-flex items-center gap-2.5 rounded-full border border-sep bg-bg-alt px-4 py-2 text-[13.5px] text-gray-2 ${className}`}
      >
        <CheckCircle size={16} weight="fill" className="shrink-0 text-blue" />
        <span>{t.on}</span>
        <button
          type="button"
          onClick={disable}
          disabled={busy}
          className="font-medium text-blue transition-opacity hover:opacity-70 disabled:opacity-50"
        >
          {t.disable}
        </button>
      </div>
    );
  }

  if (state === "denied") {
    return (
      <p
        className={`max-w-md text-[13.5px] leading-relaxed text-gray ${className}`}
        role="status"
      >
        {t.denied}
      </p>
    );
  }

  if (state === "error") {
    return (
      <p
        className={`max-w-md text-[13.5px] leading-relaxed text-gray ${className}`}
        role="status"
      >
        {t.error}
      </p>
    );
  }

  return (
    <div className={`max-w-lg ${className}`}>
      <button
        type="button"
        onClick={enable}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-full bg-bg-alt px-4 py-2 text-[13.5px] font-medium text-ink transition-colors duration-300 hover:bg-sep/60 disabled:opacity-60"
      >
        <Bell size={16} weight="regular" className="text-blue" />
        {busy ? t.on : t.enable}
      </button>
      <p className="mt-2 text-[13px] leading-relaxed text-gray">{t.explain}</p>
    </div>
  );
}
