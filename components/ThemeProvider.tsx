"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";
export type Resolved = "light" | "dark";

const STORAGE_KEY = "cmb-theme";

interface ThemeCtx {
  theme: Theme;
  resolved: Resolved;
  setTheme: (t: Theme) => void;
  toggle: () => void;
  ready: boolean;
}

const Ctx = createContext<ThemeCtx | null>(null);

function systemPrefersDark() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolve(t: Theme): Resolved {
  if (t === "system") return systemPrefersDark() ? "dark" : "light";
  return t;
}

/**
 * Runs before paint to stop a flash of the wrong theme.
 *
 * Must stay inline and blocking in <head>. It reads the same localStorage key
 * the provider uses, so the two never disagree.
 *
 * It sets the class only. `color-scheme` is deliberately left to the provider,
 * which sets it a moment after hydration: the server cannot know a preference
 * stored in the browser, and writing it here puts a `style` attribute on
 * <html> that the server-rendered markup never had.
 */
export const themeInitScript = `
(function () {
  try {
    var s = localStorage.getItem('${STORAGE_KEY}') || 'system';
    var dark = s === 'dark' || (s === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {}
})();
`.trim();

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolved, setResolved] = useState<Resolved>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stored: Theme = "system";
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (raw === "light" || raw === "dark" || raw === "system") stored = raw;
    } catch {
      /* storage blocked - fall back to the OS preference */
    }
    setThemeState(stored);
    setResolved(resolve(stored));
    setReady(true);
  }, []);

  // Follow the OS while the preference is "system".
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setResolved(mq.matches ? "dark" : "light");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  // Apply to <html>, and keep the browser UI (scrollbars, form controls) in sync.
  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    root.classList.toggle("dark", resolved === "dark");
    root.style.colorScheme = resolved;

    // Sync the meta tag so the iOS/Android status bar matches.
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", resolved === "dark" ? "#000000" : "#ffffff");
  }, [resolved, ready]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    setResolved(resolve(t));
    try {
      window.localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* storage blocked - the theme still applies for this session */
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(resolved === "dark" ? "light" : "dark");
  }, [resolved, setTheme]);

  return (
    <Ctx.Provider value={{ theme, resolved, setTheme, toggle, ready }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
