"use client";

import Icon from "@/components/Icons";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { useLanguage, LANGS } from "./LanguageProvider";

/**
 * Language control for the navigation bar.
 *
 * Switching happens entirely client-side - no reload, no route change. The
 * whole tree cross-fades via the key on <AnimatePresence> in the provider, so
 * text morphs instead of popping.
 */
export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = LANGS.find((l) => l.id === lang)!;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Language: ${current.label}`}
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[14px] font-medium text-gray-2 transition-colors duration-200 hover:bg-ink/[0.06] hover:text-ink"
      >
        <span
          className="min-w-[22px] text-center leading-none"
          style={{
            // Force a real Arabic face so the glyph reads as Arabic, not Latin.
            fontFamily:
              '"SF Arabic", "Geeza Pro", "Noto Sans Arabic", "Segoe UI", "Tahoma", sans-serif',
          }}
        >
          {current.short}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            className="frosted absolute end-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl p-1.5"
            style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.14)" }}
            role="menu"
          >
            {LANGS.map((l) => (
              <button
                key={l.id}
                type="button"
                role="menuitem"
                onClick={() => {
                  setLang(l.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[14px] transition-colors ${
                  l.id === lang
                    ? "bg-ink/[0.06] font-medium text-ink"
                    : "text-gray-2 hover:bg-ink/[0.04] hover:text-ink"
                }`}
              >
                <span className="text-[16px] leading-none" aria-hidden>
                  {l.flag}
                </span>
                <span className="flex-1">{l.native}</span>
                {l.id === lang && (
                  <span className="text-[12px] text-blue" aria-hidden>
                    ✓
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
