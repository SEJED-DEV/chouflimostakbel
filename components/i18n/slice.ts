"use client";

import { useLanguage, type Lang } from "@/components/LanguageProvider";
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
