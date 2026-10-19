"use client";

import { useEffect, useState } from "react";
import { Bell } from "@phosphor-icons/react/dist/ssr/Bell";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { useSlice } from "@/components/i18n/slice";
import { push as pushCopy } from "@/components/i18n/push";
import {
  currentSubscription,
  disablePush,
  enablePush,
  iosWithoutApp,
  pushSupported,
} from "@/lib/push-client";

/**
 * The explicit control for update alerts, on the changelog page.
 *
 * This one is not a prompt: it stays put so a reader who came here looking
 * for it can turn it on or off whenever they like. The site-wide ask lives
 * in PushPrompt and follows its own schedule.
 */

type State = "checking" | "unsupported" | "off" | "on" | "denied" | "error";

export default function PushOptIn({ className = "" }: { className?: string }) {
  const t = useSlice(pushCopy);
  const [state, setState] = useState<State>("checking");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!pushSupported() || iosWithoutApp()) {
        if (!cancelled) setState("unsupported");
        return;
      }

      if (Notification.permission === "denied") {
        if (!cancelled) setState("denied");
        return;
      }

      try {
        const existing = await currentSubscription();
        if (!cancelled) setState(existing ? "on" : "off");
      } catch {
        if (!cancelled) setState("off");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function onEnable() {
    if (busy) return;
    setBusy(true);
    try {
      const subscription = await enablePush();
      setState(subscription ? "on" : Notification.permission === "denied" ? "denied" : "error");
    } catch {
      setState("error");
    } finally {
      setBusy(false);
    }
  }

  async function onDisable() {
    if (busy) return;
    setBusy(true);
    try {
      await disablePush();
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
          onClick={onDisable}
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
        onClick={onEnable}
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
