"use client";

import Icon, { type IconName } from "@/components/Icons";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Image from "next/image";

import { useLanguage } from "./LanguageProvider";
import {
  capturePrompt,
  canPromptDirectly,
  isInstalled,
  isIosSafari,
  promptInstall,
  subscribe,
  INSTALL_SHEET,
} from "@/lib/pwa";

const STORAGE_KEY = "cmb-install-dismissed";
/** Dismiss it for a week, then offer again - not forever, and not every visit. */
const REASK_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

function wasRecentlyDismissed(): boolean {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const at = Number(raw);
    if (Number.isFinite(at) && Date.now() - at < REASK_AFTER_MS) return true;
    window.localStorage.removeItem(STORAGE_KEY);
    return false;
  } catch {
    return false;
  }
}

/**
 * Install sheet.
 *
 * Two states, because the browser gives us two very different situations:
 *
 *  - A real `beforeinstallprompt` was captured: offer the native prompt.
 *  - No prompt available. iOS never fires one at all, and every browser needs
 *    a service worker to be *controlling* the page before it will - which on a
 *    first visit it is not. Either way we still owe the user an answer, so we
 *    explain the manual route instead of showing a lone "Not now".
 */
export default function InstallPrompt() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();

  const [canPrompt, setCanPrompt] = useState(false);
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [manual, setManual] = useState(false);

  // ---------------------------------------------------------------------
  // Always-on. This must never be gated on the dismissal preference:
  // if it were, a dismissed visitor would stop capturing the event
  // entirely and the download buttons would have nothing to prompt with.
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (isInstalled()) return;

    const onInstalled = () => setInstalled(true);
    window.addEventListener("appinstalled", onInstalled);

    const onPrompt = (e: Event) => {
      // Suppress the browser's own mini-infobar; we render our own.
      e.preventDefault();
      capturePrompt(e as Parameters<typeof capturePrompt>[0]);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    const unsubscribe = subscribe(() => setCanPrompt(canPromptDirectly()));
    const unregisterSheet = INSTALL_SHEET.subscribe({
      show: () => {
        setShow(true);
        setManual(!canPromptDirectly());
      },
    });

    setCanPrompt(canPromptDirectly());

    return () => {
      unsubscribe();
      unregisterSheet();
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  // ---------------------------------------------------------------------
  // Auto-offer, only when not recently dismissed.
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (installed || wasRecentlyDismissed()) return;
    if (!canPrompt) return;
    // Let the language / what's-new sheets clear first.
    const id = window.setTimeout(() => {
      setManual(false);
      setShow(true);
    }, 900);
    return () => window.clearTimeout(id);
  }, [canPrompt, installed]);

  const dismiss = useCallback(() => {
    setShow(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      /* storage blocked - it will offer again next visit */
    }
  }, []);

  const accept = useCallback(async () => {
    if (canPrompt) {
      await promptInstall();
      setCanPrompt(canPromptDirectly());
      dismiss();
    } else {
      // Nothing to prompt with - send them to the manual instructions.
      setShow(false);
      setManual(true);
      const id = window.setTimeout(() => setShow(true), 60);
      return () => window.clearTimeout(id);
    }
  }, [canPrompt, dismiss]);

  useEffect(() => {
    if (!show) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [show, dismiss]);

  if (installed) return null;

  const ios = isIosSafari();
  const steps = ios
    ? [t.ios.step1, t.ios.step2, t.ios.step3]
    : [t.manual.step1, t.manual.step2, t.manual.step3];
  const icons: IconName[] = ios
    ? ["share", "square-plus", "circle-check"]
    : ["circle-check", "circle-check", "circle-check"];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-end justify-center p-4 sm:items-center sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={ios ? t.ios.title : t.install.title}
        >
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[6px]" onClick={dismiss} />

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 26, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.97 }}
            transition={
              reduce
                ? { duration: 0 }
                : { type: "spring", stiffness: 400, damping: 33, mass: 0.85 }
            }
            className="frosted relative w-full max-w-sm rounded-[28px] p-7"
            style={{
              boxShadow:
                "0 24px 70px rgba(0,0,0,0.24), inset 0 0 0 0.5px rgba(255,255,255,0.7)",
            }}
          >
            <div aria-hidden className="mx-auto mb-5 h-1 w-9 rounded-full bg-sep sm:hidden" />

            <div className="flex items-start gap-4">
              <Image
                src="/icons/icon-192.png"
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 shrink-0 rounded-xl"
                style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.12)" }}
              />
              <h2 className="pt-0.5 text-[20px] font-semibold tracking-[-0.02em] text-ink">
                {ios ? t.ios.title : t.install.title}
              </h2>
            </div>

            <p className="mt-4 text-[15px] leading-relaxed text-gray-2">
              {ios ? t.ios.body : manual ? t.manual.body : t.install.body}
            </p>

            {!canPrompt && (
              <ol className="mt-5 space-y-2.5">
                {steps.map((step, i) => {
                  const icon = icons[i];
                  return (
                    <li key={step} className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue"
                      >
                        <Icon name={icon} size={15} />
                      </span>
                      <span className="pt-1 text-[14.5px] leading-snug text-ink">
                        {step}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}

            <div className="mt-6 flex gap-2.5">
              {canPrompt && (
                <button
                  type="button"
                  onClick={accept}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-blue px-5 py-2.5 text-[15px] font-medium text-white shadow-[0_6px_18px_rgba(0,113,227,0.26)] transition-colors duration-300 hover:bg-blue-hi"
                >
                  <Icon name="download" size={15} />
                  {t.install.action}
                </button>
              )}
              <button
                type="button"
                onClick={dismiss}
                className="flex-1 rounded-full bg-bg-alt px-5 py-2.5 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-sep/60"
              >
                {canPrompt ? t.install.later : t.manual.gotIt}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
