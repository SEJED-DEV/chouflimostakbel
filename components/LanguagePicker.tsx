"use client";

import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useEffect } from "react";
import { useLanguage, LANGS, type Lang } from "./LanguageProvider";

/**
 * First-visit language picker. Apple-style sheet: frosted card, spring scale-in,
 * dimmed backdrop. Shown only when no language has been stored in localStorage.
 */
export default function LanguagePicker() {
  const { needsChoice, setLang, lang, t } = useLanguage();
  const reduce = useReducedMotion();

  // Freeze the page behind the sheet.
  useEffect(() => {
    if (!needsChoice) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [needsChoice]);

  return (
    <AnimatePresence>
      {needsChoice && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.28 }}
        >
          {/* Dim + blur the page behind */}
          <div
            className="absolute inset-0 bg-black/25 backdrop-blur-[6px]"
            onClick={() => setLang(lang)}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Choose your language"
            initial={reduce ? false : { opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
            transition={
              reduce
                ? { duration: 0 }
                : { type: "spring", stiffness: 420, damping: 32, mass: 0.8 }
            }
            className="frosted relative w-full max-w-sm rounded-[28px] p-7 text-center"
            style={{
              boxShadow:
                "0 24px 70px rgba(0,0,0,0.22), inset 0 0 0 0.5px rgba(255,255,255,0.7)",
            }}
          >
            {/* Grabber */}
            <div className="mx-auto mb-5 h-1 w-9 rounded-full bg-sep" aria-hidden />

            <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
              {t.langPicker.title}
            </h2>
            <p className="mt-1.5 text-[14px] text-gray-2">
              {t.langPicker.subtitle}
            </p>

            <div className="mt-6 space-y-2">
              {LANGS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLang(l.id)}
                  className="group flex w-full items-center gap-3.5 rounded-2xl bg-bg-alt px-4 py-3.5 text-left transition-all duration-200 hover:bg-sep/45 active:scale-[0.985]"
                >
                  <span className="text-[22px] leading-none" aria-hidden>
                    {l.flag}
                  </span>
                  <span className="flex-1 text-[16px] font-medium text-ink">
                    {l.native}
                  </span>
                  <span className="text-[13px] text-gray">{l.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export type { Lang };
