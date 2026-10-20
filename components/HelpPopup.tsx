"use client";

import Icon from "@/components/Icons";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

import { useLanguage } from "./LanguageProvider";
import { REPO_URL } from "@/lib/site";

const STORAGE_KEY = "cmb-help-seen";

/**
 * Scoped to the /soon page on purpose. Asking every visitor on the homepage
 * whether they want to help build the platform would be a sales pitch dressed
 * up as a question; here it is a fair offer, because they have deliberately
 * come to look at the roadmap.
 *
 * Asked once and never again - declining is permanent, not snoozed.
 */
export default function HelpPopup() {
  const { t, needsChoice, ready } = useLanguage();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!ready || needsChoice) return;

    try {
      if (window.localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      /* storage blocked - ask once per session instead of never */
    }

    const id = window.setTimeout(() => setOpen(true), 800);
    return () => window.clearTimeout(id);
  }, [ready, needsChoice]);

  function close() {
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
      // Tell the what's-new sheet we already had the visitor's attention.
      window.sessionStorage.setItem("cmb-help-shown", "1");
    } catch {
      /* storage blocked */
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
          className="fixed inset-0 z-[92] flex items-end justify-center p-4 sm:items-center sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.26 }}
          role="dialog"
          aria-modal="true"
          aria-label={t.help.title}
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
            className="frosted relative w-full max-w-md rounded-[28px] p-7"
            style={{
              boxShadow:
                "0 24px 70px rgba(0,0,0,0.24), inset 0 0 0 0.5px rgba(255,255,255,0.7)",
            }}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-5 end-5 flex h-8 w-8 items-center justify-center rounded-full text-gray transition-colors hover:bg-ink/[0.06] hover:text-ink"
            >
              <Icon name="xmark" size={15} />
            </button>

            <div className="text-center">
              <div
                aria-hidden
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue text-white"
              >
                <Icon name="rocket" size={24} />
              </div>

              <h2 className="mt-5 text-[22px] font-semibold tracking-[-0.02em] text-ink">
                {t.help.title}
              </h2>
              <p className="mx-auto mt-2.5 max-w-sm text-[15px] leading-relaxed text-gray-2">
                {t.help.body}
              </p>

              <div className="mt-7 flex flex-col gap-2.5">
                <Link
                  href="/soon"
                  onClick={close}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-blue px-6 py-3 text-[16px] font-medium text-white shadow-[0_8px_24px_rgba(0,113,227,0.28)] transition-colors duration-300 hover:bg-blue-hi"
                >
                  {t.help.yes}
                  <Icon name="arrow-right" size={15} />
                </Link>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-full bg-bg-alt px-6 py-3 text-[16px] font-medium text-ink transition-colors duration-300 hover:bg-sep/60"
                >
                  {t.help.no}
                </button>
              </div>

              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block text-[13px] text-gray underline decoration-sep underline-offset-4 transition-colors hover:text-blue"
              >
                {t.help.repo}
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
