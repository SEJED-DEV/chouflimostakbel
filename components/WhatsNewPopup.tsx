"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { X } from "@phosphor-icons/react/dist/ssr/X";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { useLanguage } from "./LanguageProvider";
import { useSlice } from "@/components/i18n/slice";
import { changelog } from "@/components/i18n/changelog";
import ChangelogCommits from "@/components/ChangelogCommits";

const STORAGE_KEY = "cmb-version";

/**
 * "What's new" sheet.
 *
 * Version-gated, NOT a permanent flag. It stores the version the visitor last
 * saw, so it reappears whenever a release is newer than that - and stays
 * quiet in between. Bumping the changelog is all it takes to notify people.
 *
 * First-time visitors get the latest entry as a welcome. Returning visitors
 * get every entry newer than the one they last saw.
 */
export default function WhatsNewPopup() {
  const { t, needsChoice, ready } = useLanguage();
  const c = useSlice(changelog);
  const reduce = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [fresh, setFresh] = useState<typeof c.entries>([]);

  useEffect(() => {
    if (!ready || needsChoice) return;

    const entries = c.entries;
    if (!entries.length) return;

    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      /* storage blocked - fall back to showing the latest */
    }

    let show: typeof entries = [];

    if (!stored) {
      // Never seen it: introduce the latest release.
      show = entries.slice(0, 1);
    } else {
      const idx = entries.findIndex((e) => e.version === stored);
      if (idx === -1) {
        // Version they knew is gone from the list - show what's here now.
        show = entries.slice(0, 1);
      } else if (idx > 0) {
        // Everything newer than what they last saw.
        show = entries.slice(0, idx);
      }
      // idx === 0 means already current: stay quiet.
    }

    if (show.length === 0) return;

    setFresh(show);
    // Let the language sheet clear first so the two never overlap.
    const id = window.setTimeout(() => setOpen(true), 700);
    return () => window.clearTimeout(id);
  }, [ready, needsChoice, c.entries]);

  function close() {
    setOpen(false);
    try {
      // Store the newest version we know about, not a boolean.
      window.localStorage.setItem(STORAGE_KEY, c.entries[0].version);
    } catch {
      /* storage blocked - it will offer again next visit */
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

  const headline = fresh[0];
  if (!headline) return null;

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
          aria-label={c.popup.title}
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
            className="frosted relative max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-[28px] p-7"
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
              <X size={15} weight="bold" />
            </button>

            {/* Version badge */}
            <span className="inline-flex items-center rounded-full bg-blue/10 px-3 py-1 text-[12px] font-semibold text-blue">
              {headline.version}
            </span>

            <h2 className="mt-3.5 pr-8 text-[22px] font-semibold tracking-[-0.02em] text-ink">
              {c.popup.title}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-gray-2">
              {headline.summary}
            </p>

            {/* Changes for each unseen release */}
            <div className="mt-5 space-y-4">
              {fresh.map((entry) => (
                <div key={entry.version}>
                  {fresh.length > 1 && (
                    <p className="mb-2 flex items-baseline gap-2 text-[13px]">
                      <span className="font-semibold text-ink">{entry.version}</span>
                      <span className="text-gray">{entry.date}</span>
                    </p>
                  )}
                  <ul className="space-y-2">
                    {entry.changes.map((change) => (
                      <li
                        key={change}
                        className="flex gap-2.5 text-[14.5px] leading-relaxed text-gray-2"
                      >
                        <span
                          aria-hidden
                          className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-blue"
                        />
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <ChangelogCommits entry={headline} label={c.commitsLabel} />

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row-reverse sm:justify-between">
              <Link
                href="/changelog"
                onClick={close}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-blue px-5 py-2.5 text-[15px] font-medium text-white shadow-[0_6px_18px_rgba(0,113,227,0.26)] transition-colors duration-300 hover:bg-blue-hi"
              >
                {c.popup.seeAll}
                <ArrowRight size={15} weight="bold" />
              </Link>
              <button
                type="button"
                onClick={close}
                className="rounded-full bg-bg-alt px-5 py-2.5 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-sep/60"
              >
                {c.popup.close}
              </button>
            </div>

            <p className="mt-4 text-center text-[11.5px] text-gray">
              {t.footer.rights.copyright}{" "}
              <span className="font-semibold text-ink">{t.footer.rights.brand}</span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
