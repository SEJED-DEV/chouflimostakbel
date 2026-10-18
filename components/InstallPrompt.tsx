"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Image from "next/image";
import { DownloadSimple } from "@phosphor-icons/react/dist/ssr/DownloadSimple";
import { X } from "@phosphor-icons/react/dist/ssr/X";
import { useLanguage } from "./LanguageProvider";

const STORAGE_KEY = "cmb-install-dismissed";
/** Dismiss it for a week, then offer again - not forever, and not every visit. */
const REASK_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari reports installed apps via navigator.standalone
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIosSafari() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua) || (ua.includes("Macintosh") && "ontouchend" in document);
  // Exclude in-app browsers and Chrome/Firefox on iOS, which cannot install.
  return iOS && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
}

/**
 * PWA install prompt.
 *
 * Uses the browser's `beforeinstallprompt` where available (Chrome, Edge,
 * Android). iOS Safari never fires that event and has no install API, so it
 * gets the manual Share -> Add to Home Screen instructions instead.
 *
 * Dismissal is a timestamp, not a permanent flag: it comes back after a week
 * rather than never, and not on every single visit either.
 */
export default function InstallPrompt() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();

  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;

    // Respect a recent dismissal.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const at = Number(raw);
        if (Number.isFinite(at) && Date.now() - at < REASK_AFTER_MS) return;
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      /* storage blocked - fall through and offer it */
    }

    const onInstalled = () => setInstalled(true);
    window.addEventListener("appinstalled", onInstalled);

    const onPrompt = (e: Event) => {
      // Suppress the browser's own mini-infobar; we render our own.
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    // iOS has no install event, so offer the manual route on first load.
    let t: number | undefined;
    if (isIosSafari()) {
      t = window.setTimeout(() => setShow(true), 3500);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      if (t) window.clearTimeout(t);
    };
  }, []);

  const dismiss = useCallback((remember = true) => {
    setShow(false);
    if (!remember) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      /* storage blocked - it will offer again next visit */
    }
  }, []);

  const accept = useCallback(async () => {
    if (!deferred) {
      dismiss();
      return;
    }
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    dismiss();
  }, [deferred, dismiss]);

  // Nothing to offer.
  if (installed || isStandalone()) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-[80] flex justify-center p-3 sm:inset-0 sm:items-center sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={t.install.title}
        >
          {/* Scrim only on desktop, where the sheet is centred. */}
          <div
            className="absolute inset-0 hidden bg-black/25 backdrop-blur-[6px] sm:block"
            onClick={() => dismiss()}
          />

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
            transition={
              reduce
                ? { duration: 0 }
                : { type: "spring", stiffness: 400, damping: 34, mass: 0.8 }
            }
            className="frosted relative w-full max-w-sm rounded-[26px] p-6"
            style={{
              boxShadow:
                "0 24px 70px rgba(0,0,0,0.24), inset 0 0 0 0.5px rgba(255,255,255,0.7)",
            }}
          >
            {/* Grabber on mobile, where it reads as a sheet. */}
            <div
              aria-hidden
              className="mx-auto mb-4 h-1 w-9 rounded-full bg-sep sm:hidden"
            />

            <div className="flex items-start gap-4">
              <Image
                src="/icons/icon-192.png"
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 shrink-0 rounded-xl"
                style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.12)" }}
              />

              <div className="min-w-0 flex-1">
                <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-ink">
                  {t.install.title}
                </h2>
                <p className="mt-1 text-[14px] leading-relaxed text-gray-2">
                  {t.install.body}
                </p>
              </div>

              <button
                type="button"
                onClick={() => dismiss()}
                aria-label="Close"
                className="-mt-1 -me-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray transition-colors hover:bg-ink/[0.06] hover:text-ink"
              >
                <X size={15} weight="bold" />
              </button>
            </div>

            {/* iOS has no install API - spell it out instead. */}
            {!deferred && isIosSafari() && (
              <ol className="mt-4 space-y-1.5 rounded-xl bg-bg-alt px-4 py-3 text-[13px] leading-relaxed text-gray-2">
                <li>{t.install.iosStep1}</li>
                <li>{t.install.iosStep2}</li>
              </ol>
            )}

            <div className="mt-5 flex gap-2.5">
              {deferred && (
                <button
                  type="button"
                  onClick={accept}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-blue px-5 py-2.5 text-[15px] font-medium text-white shadow-[0_6px_18px_rgba(0,113,227,0.26)] transition-colors duration-300 hover:bg-blue-hi"
                >
                  <DownloadSimple size={15} weight="bold" />
                  {t.install.action}
                </button>
              )}
              <button
                type="button"
                onClick={() => dismiss()}
                className="flex-1 rounded-full bg-bg-alt px-5 py-2.5 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-sep/60"
              >
                {t.install.later}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
