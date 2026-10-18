"use client";

import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Sun } from "@phosphor-icons/react/dist/ssr/Sun";
import { Moon } from "@phosphor-icons/react/dist/ssr/Moon";
import { useTheme } from "./ThemeProvider";

/**
 * Light / dark toggle for the nav capsule.
 *
 * Cross-fades between the two glyphs and rotates the sun, so the change reads
 * as deliberate rather than a flicker.
 */
export default function ThemeToggle({
  variant = "desktop",
}: {
  variant?: "desktop" | "compact";
}) {
  const { resolved, toggle, ready } = useTheme();
  const reduce = useReducedMotion();

  const isDark = resolved === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  const cls =
    variant === "compact"
      ? "flex h-9 w-9 items-center justify-center rounded-full text-gray-2 transition-colors hover:bg-ink/[0.06] hover:text-ink"
      : "flex items-center gap-1.5 rounded-full px-3 py-2 text-[14px] font-medium text-gray-2 transition-colors duration-200 hover:bg-ink/[0.06] hover:text-ink";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={ready ? label : "Toggle theme"}
      title={label}
      className={cls}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={
              reduce
                ? false
                : { opacity: 0, scale: 0.6, rotate: isDark ? -40 : 40 }
            }
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.6, rotate: isDark ? 40 : -40 }
            }
            transition={
              reduce
                ? { duration: 0 }
                : { type: "spring", stiffness: 420, damping: 26 }
            }
            className="absolute inset-0 flex items-center justify-center"
          >
            {isDark ? (
              <Moon size={18} weight="fill" />
            ) : (
              <Sun size={18} weight="fill" />
            )}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}
