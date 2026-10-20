"use client";

import Icon from "@/components/Icons";
import { useEffect, useState } from "react";

import { useSlice } from "@/components/i18n/slice";
import { push as pushCopy } from "@/components/i18n/push";
import { enablePush, iosWithoutApp, pushSupported } from "@/lib/push-client";
import {
  markDenied,
  markDismissed,
  markShown,
  readState,
  shouldShow,
  writeState,
} from "@/lib/push-prompt";

type Phase = "hidden" | "ask" | "blocked";

/**
 * The site-wide ask for notification permission.
 *
 * It lives in the footer, so it appears when someone has scrolled to the
 * end rather than interrupting them at the top of the page. The browser's
 * own dialog is the one that actually grants permission, and it is only ever
 * called from a click.
 *
 * How often it appears is decided in lib/push-prompt.ts: ask, remind for a
 * day, then leave them alone.
 */
export default function PushPrompt({ className = "" }: { className?: string }) {
  const t = useSlice(pushCopy);
  const [phase, setPhase] = useState<Phase>("hidden");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!pushSupported()) return;
    if (iosWithoutApp()) return;

    const now = Date.now();
    const state = readState();
    const permission = Notification.permission;

    if (!shouldShow(state, now, permission)) return;

    // Record that it was shown, so the next reminder waits for the snooze.
    writeState(markShown(state, now));
    setPhase(permission === "denied" ? "blocked" : "ask");
  }, []);

  async function onEnable() {
    if (busy) return;
    setBusy(true);
    const now = Date.now();
    try {
      const subscription = await enablePush();
      if (subscription) {
        setPhase("hidden");
        return;
      }
      // Refused at the browser level. That is permanent for the origin, so
      // say it once with instructions and then stop.
      writeState(markDenied(readState(), now));
      setPhase("blocked");
    } catch {
      setPhase("hidden");
    } finally {
      setBusy(false);
    }
  }

  function onLater() {
    writeState(markDismissed(readState(), Date.now()));
    setPhase("hidden");
  }

  if (phase === "hidden") return null;

  return (
    <div
      className={`flex max-w-2xl items-start gap-3.5 rounded-2xl border border-sep bg-bg p-4 sm:p-5 ${className}`}
      role="status"
    >
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-bg-alt">
        <Icon name="bell" size={18} className="text-blue" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold text-ink">
          {phase === "blocked" ? t.denied : t.promptTitle}
        </p>
        <p className="mt-1.5 text-[14px] leading-relaxed text-gray-2">
          {phase === "blocked" ? t.explain : t.promptBody}
        </p>

        {phase === "ask" && (
          <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onEnable}
              disabled={busy}
              className="rounded-full bg-blue px-4 py-2 text-[14px] font-medium text-white transition-colors duration-300 hover:bg-blue-hi disabled:opacity-60"
            >
              {t.enable}
            </button>
            <button
              type="button"
              onClick={onLater}
              className="rounded-full bg-bg-alt px-4 py-2 text-[14px] font-medium text-ink transition-colors duration-300 hover:bg-sep/60"
            >
              {t.later}
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onLater}
        aria-label={t.later}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray transition-colors hover:bg-ink/[0.06] hover:text-ink"
      >
        <Icon name="xmark" size={14} />
      </button>
    </div>
  );
}
