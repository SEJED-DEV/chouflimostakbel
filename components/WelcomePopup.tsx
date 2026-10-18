"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { X } from "@phosphor-icons/react/dist/ssr/X";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { useLanguage } from "./LanguageProvider";
import { site } from "@/lib/site";

const STORAGE_KEY = "cmb-welcome-seen";

/**
 * Shown once, after the visitor has picked a language.
 *
 * Order is deliberate: the language sheet owns the first visit, so this waits
 * until a language is actually chosen - otherwise the two modals race and the
 * welcome message can end up underneath.
 */
export default function WelcomePopup() {
  const { t, needsChoice, ready } = useLanguage();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!ready || needsChoice) return;

    let seen = false;
    try {
      seen = window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      /* storage blocked - show once per session rather than never */
    }
    if (seen) return;

    // A beat after the language sheet is gone, so the two never overlap.
    const id = window.setTimeout(() => setOpen(true), 700);
    return () => window.clearTimeout(id);
  }, [ready, needsChoice]);

  function close() {
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* nothing we can do; it will re-ask next visit */
    }
  }

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.26 }}
          role="dialog"
          aria-modal="true"
          aria-label={t.welcome.title}
        >
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[6px]" onClick={close} />

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 16 }}
            transition={
              reduce
                ? { duration: 0 }
                : { type: "spring", stiffness: 400, damping: 33, mass: 0.85 }
            }
            className="frosted relative w-full max-w-md rounded-[28px] p-7 sm:p-8"
            style={{
              boxShadow:
                "0 24px 70px rgba(0,0,0,0.22), inset 0 0 0 0.5px rgba(255,255,255,0.7)",
            }}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-5 end-5 flex h-8 w-8 items-center justify-center rounded-full text-gray transition-colors hover:bg-ink/[0.06] hover:text-ink"
            >
              <X size={16} weight="bold" />
            </button>

            <div className="text-center">
              <div
                aria-hidden
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue text-[22px] font-semibold text-white"
              >
                &#8250;
              </div>

              <h2 className="mt-5 text-[22px] font-semibold tracking-[-0.02em] text-ink">
                {t.welcome.title}
              </h2>
              <p className="mx-auto mt-2.5 max-w-sm text-[15px] leading-relaxed text-gray-2">
                {t.welcome.body}
              </p>

              <div className="mt-7 flex flex-col gap-2.5 sm:flex-row-reverse sm:justify-center">
                <Link
                  href={t.welcome.ctaHref}
                  onClick={close}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-blue px-6 py-3 text-[16px] font-medium text-white shadow-[0_8px_24px_rgba(0,113,227,0.28)] transition-all duration-300 hover:bg-blue-hi"
                >
                  {t.welcome.cta}
                  <ArrowRight size={15} weight="bold" />
                </Link>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-full bg-bg-alt px-6 py-3 text-[16px] font-medium text-ink transition-colors duration-300 hover:bg-sep/60"
                >
                  {t.welcome.later}
                </button>
              </div>

              <p className="mt-5 text-[12px] text-gray">
                <a
                  href={`mailto:${site.email}`}
                  className="underline underline-offset-2 transition-colors hover:text-blue"
                >
                  {site.email}
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
