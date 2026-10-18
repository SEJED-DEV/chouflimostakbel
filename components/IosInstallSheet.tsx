"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ShareNetwork } from "@phosphor-icons/react/dist/ssr/ShareNetwork";
import { PlusSquare } from "@phosphor-icons/react/dist/ssr/PlusSquare";
import { Check } from "@phosphor-icons/react/dist/ssr/Check";
import { useLanguage } from "./LanguageProvider";
import { isInstalled, isIosSafari, INSTALL_SHEET } from "@/lib/pwa";

/**
 * iOS-only install sheet.
 *
 * iOS Safari has no install API and deliberately does not fire
 * beforeinstallprompt, so there is nothing to prompt with. Tapping the
 * download button on iOS therefore opens this instead: a short, honest
 * explanation plus the three taps it actually takes.
 *
 * Never auto-opens - it only ever answers a tap.
 */
export default function IosInstallSheet() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const unregister = INSTALL_SHEET.subscribe({
      show: () => setOpen(true),
    });
    return unregister;
  }, []);

  // Pointless on anything that can install itself, and wrong once installed.
  if (!isIosSafari() || isInstalled()) return null;

  function close() {
    setOpen(false);
    try {
      // Do not nag on the next visit either.
      window.localStorage.setItem("cmb-install-dismissed", String(Date.now()));
    } catch {
      /* storage blocked */
    }
  }

  const steps = [t.ios.step1, t.ios.step2, t.ios.step3];
  const icons = [ShareNetwork, PlusSquare, Check];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-end justify-center p-4 sm:items-center sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={t.ios.title}
        >
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[6px]" onClick={close} />

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
                {t.ios.title}
              </h2>
            </div>

            <p className="mt-4 text-[15px] leading-relaxed text-gray-2">{t.ios.body}</p>

            <ol className="mt-5 space-y-2.5">
              {steps.map((step, i) => {
                const Icon = icons[i];
                return (
                  <li key={step} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue"
                    >
                      <Icon size={15} weight="bold" />
                    </span>
                    <span className="pt-1 text-[14.5px] leading-snug text-ink">
                      {step}
                    </span>
                  </li>
                );
              })}
            </ol>

            <button
              type="button"
              onClick={close}
              className="mt-6 w-full rounded-full bg-blue px-6 py-3 text-[16px] font-medium text-white shadow-[0_6px_18px_rgba(0,113,227,0.26)] transition-colors duration-300 hover:bg-blue-hi"
            >
              {t.ios.gotIt}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
