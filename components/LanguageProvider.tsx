"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { dictionaries } from "./dictionaries";

export type Lang = "en" | "fr" | "ar";

export const LANGS: {
  id: Lang;
  label: string;
  native: string;
  flag: string;
  /** Compact code shown in the nav button. */
  short: string;
}[] = [
  { id: "en", label: "English", native: "English", flag: "\u{1F1EC}\u{1F1E7}", short: "EN" },
  { id: "fr", label: "French", native: "Fran\u00e7ais", flag: "\u{1F1EB}\u{1F1F7}", short: "FR" },
  // Arabic is abbreviated with its own script rather than a Latin code:
  // 'ayn, the first letter of the word 'arabi.
  {
    id: "ar",
    label: "Arabic",
    native: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629",
    flag: "\u{1F1F4}\u{1F1E6}",
    short: "\u0639",
  },
];

const STORAGE_KEY = "cmb-lang";
const RTL_LANGS: Lang[] = ["ar"];

type Dict = typeof import("./dictionaries").en;

interface Ctx {
  lang: Lang;
  dir: "ltr" | "rtl";
  t: Dict;
  setLang: (l: Lang) => void;
  /** Translates a Bac section id. */
  sectionName: (s: { label: string; labelFr: string; labelAr: string }) => string;
  /** Translates a scoring subject key. */
  subjectName: (key: string) => string;
  /** True once the stored preference has been read (avoids a flash of EN). */
  ready: boolean;
  /** True when the visitor has not chosen a language yet. */
  needsChoice: boolean;
  dismissChoice: () => void;
}

const LanguageContext = createContext<Ctx | null>(null);

function detect(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored && ["en", "fr", "ar"].includes(stored)) return stored;
  } catch {
    /* storage blocked */
  }
  for (const l of navigator.languages ?? [navigator.language]) {
    const base = l.slice(0, 2).toLowerCase() as Lang;
    if (["en", "fr", "ar"].includes(base)) return base;
  }
  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [ready, setReady] = useState(false);
  const [needsChoice, setNeedsChoice] = useState(false);

  useEffect(() => {
    let chosen = false;
    try {
      chosen = !!window.localStorage.getItem(STORAGE_KEY);
    } catch {
      /* storage blocked */
    }
    setLangState(detect());
    setNeedsChoice(!chosen);
    setReady(true);
  }, []);

  const dir = RTL_LANGS.includes(lang) ? "rtl" : "ltr";

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir, ready]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    setNeedsChoice(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* storage blocked - language still applies for this session */
    }
  }, []);

  const value = useMemo<Ctx>(() => {
    const t = dictionaries[lang] ?? dictionaries.en;
    return {
      lang,
      dir,
      t,
      setLang,
      ready,
      needsChoice,
      dismissChoice: () => setNeedsChoice(false),
      sectionName: (s) =>
        lang === "ar" ? s.labelAr : lang === "fr" ? s.labelFr : s.label,
      subjectName: (key: string) => {
        const table = dictionaries.subjects as Record<string, Record<string, string>>;
        return table[lang]?.[key] ?? table.en?.[key] ?? key;
      },
    };
  }, [lang, dir, setLang, ready, needsChoice]);

  return (
    <LanguageContext.Provider value={value}>
      {/* Cross-fade on every language change: the page never reloads, the text
          simply morphs. Keyed on `lang` so it replays on each switch. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={lang}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </LanguageContext.Provider>
  );
}

/**
 * Returns the full language context: the active dictionary plus helpers.
 * Use `const { t, lang, setLang } = useLanguage()`.
 */
export function useT() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useT must be used inside <LanguageProvider>");
  return ctx;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
