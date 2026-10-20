"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Icon from "@/components/Icons";
import { useSlice } from "@/components/i18n/slice";
import { account } from "@/components/i18n/account";
import { useTheme, type Theme } from "./ThemeProvider";
import { useLanguage, LANGS } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";

/**
 * The settings surface.
 *
 * There are only three things a reader can change about this platform
 * today - how it looks, what language it speaks, and whether they are still
 * signed in - so this is one short sheet rather than a page with sections.
 *
 * It is a sheet on a phone and a centred card on a larger screen, because
 * both of those are where people expect a settings panel to arrive. Escape
 * and the backdrop both close it, and the page behind it stops scrolling
 * while it is open.
 */
export function SettingsSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useSlice(account);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useLanguage();
  const { profile, refresh } = useAuth();
  const reduce = useReducedMotion();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  const signOut = useCallback(async () => {
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await refresh();
      onClose();
      router.replace("/");
    } finally {
      setSigningOut(false);
    }
  }, [onClose, refresh, router]);

  const themes: { id: Theme; label: string }[] = [
    { id: "light", label: t.light },
    { id: "dark", label: t.dark },
    { id: "system", label: t.system },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
        >
          <button
            type="button"
            aria-label={t.settingsTitle}
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-black/35"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-heading"
            initial={reduce ? false : { y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: 16, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
            className="frosted relative w-full max-w-md rounded-t-3xl p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:rounded-3xl sm:pb-6"
            style={{ boxShadow: "0 24px 70px rgba(0,0,0,0.28)" }}
          >
            <h2
              id="settings-heading"
              className="text-[22px] font-semibold tracking-[-0.02em] text-ink"
            >
              {t.settingsTitle}
            </h2>
            <p className="mt-1.5 text-[15px] leading-relaxed text-gray-2">
              {t.settingsSub}
            </p>

            {/* Appearance: three states, because "follow the system" is a
                real choice and not the absence of one. */}
            <fieldset className="mt-7">
              <legend className="mb-2.5 text-[13px] font-medium text-gray-2">
                {t.appearance}
              </legend>
              <div className="flex gap-1 rounded-full bg-bg-alt p-1">
                {themes.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={theme === option.id}
                    onClick={() => setTheme(option.id)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[14px] font-medium transition-colors duration-200 ${
                      theme === option.id
                        ? "bg-bg text-ink"
                        : "text-gray-2 hover:text-ink"
                    }`}
                    style={
                      theme === option.id
                        ? { boxShadow: "0 1px 2px rgba(0,0,0,0.10)" }
                        : undefined
                    }
                  >
                    <Icon
                      name={
                        option.id === "light"
                          ? "sun"
                          : option.id === "dark"
                            ? "moon"
                            : "circle-info"
                      }
                      size={15}
                    />
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Language: the full list rather than the compact control, since
                there is room here and switching must not reload the page. */}
            <fieldset className="mt-6">
              <legend className="mb-2.5 text-[13px] font-medium text-gray-2">
                {t.language}
              </legend>
              <div className="overflow-hidden rounded-2xl bg-bg-alt">
                {LANGS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={lang === option.id}
                    onClick={() => setLang(option.id)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-start text-[15px] transition-colors duration-200 ${
                      lang === option.id
                        ? "font-medium text-ink"
                        : "text-gray-2 hover:text-ink"
                    }`}
                  >
                    <span className="text-[17px] leading-none" aria-hidden>
                      {option.flag}
                    </span>
                    <span className="flex-1">{option.native}</span>
                    {lang === option.id && (
                      <Icon name="circle-check" size={16} className="text-blue" />
                    )}
                  </button>
                ))}
              </div>
            </fieldset>

            {profile && (
              <button
                type="button"
                onClick={signOut}
                disabled={signingOut}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-bg-alt px-5 py-2.5 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-sep/60 disabled:opacity-60"
              >
                <Icon name="right-from-bracket" size={16} />
                {t.signOut}
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * The gear.
 *
 * The desktop navigation capsule carries one; on a phone there is no top bar
 * to carry anything, so the profile page renders its own and hides itself at
 * the size where the capsule comes back.
 */
export default function SettingsButton({
  className,
}: {
  /** Controls placement, including where it is hidden. */
  className?: string;
}) {
  const t = useSlice(account);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t.settingsTitle}
        title={t.settingsTitle}
        className={
          className ??
          "flex h-9 w-9 items-center justify-center rounded-full text-gray-2 transition-colors hover:bg-ink/[0.06] hover:text-ink"
        }
      >
        <Icon name="gear" size={19} />
      </button>
      <SettingsSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}
