"use client";

import { useEffect, useState } from "react";
import {
  useLanguage,
  LANG_STORAGE_KEY,
  type Lang,
} from "@/components/LanguageProvider";
import type { Slice } from "./types";

/** Returns the active language's strings, falling back to English. */
export function useSlice<L>(slice: Slice<L>): L {
  const { lang } = useLanguage();
  return (slice[lang as Lang] ?? slice.en) as L;
}

/** Non-hook variant for use inside components that already read `lang`. */
export function pick<L>(slice: Slice<L>, lang: Lang): L {
  return (slice[lang] ?? slice.en) as L;
}

/**
 * Reads the saved language without the language provider.
 *
 * The last-resort error boundary replaces the root layout, so there is no
 * provider above it and useLanguage throws. This reads the same key
 * directly, and starts in English until the stored value is known.
 */
export function useStoredLang(): Lang {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LANG_STORAGE_KEY) as Lang | null;
      if (stored === "en" || stored === "fr" || stored === "ar") setLang(stored);
    } catch {
      /* storage blocked - English is a fine fallback */
    }
  }, []);

  return lang;
}
