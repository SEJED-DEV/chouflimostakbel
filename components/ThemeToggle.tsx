"use client";

import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { Sun } from "@phosphor-icons/react/dist/ssr/Sun";
import { Moon } from "@phosphor-icons/react/dist/ssr/Moon";
import { useTheme } from "./ThemeProvider";

/**
 * Light / dark toggle for the nav capsule.
 *
 * The switch is animated rather than instant, because snapping the whole page
 * between two palettes reads as a glitch:
 *
 *  1. If the browser supports the View Transitions API, the new theme is
 *     revealed as a circular wipe expanding from this button.
 *  2. Everywhere else, `.theme-anim` eases every colour change on the page.
 *
 * Both are skipped entirely under prefers-reduced-motion.
 */
export default function ThemeToggle({
  variant = "desktop",
}: {
  variant?: "desktop" | "compact";
}) {
  const { resolved, toggle, ready } = useTheme();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);

  const isDark = resolved === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  const cls =
    variant === "compact"
      ? "flex h-9 w-9 items-center justify-center rounded-full text-gray-2 transition-colors hover:bg-ink/[0.06] hover:text-ink"
      : "flex items-center gap-1.5 rounded-full px-3 py-2 text-[14px] font-medium text-gray-2 transition-colors duration-200 hover:bg-ink/[0.06] hover:text-ink";

  function handleClick() {
    if (reduce) {
      toggle();
      return;
    }

    const root = document.documentElement;
    const startViewTransition = (
      document as Document & {
        startViewTransition?: (cb: () => void) => { ready: Promise<void> };
      }
    ).startViewTransition;

    if (typeof startViewTransition === "function" && ref.current) {
      // Circular wipe originating at the button.
      const rect = ref.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const radius = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y)
      );

      const transition = startViewTransition.call(document, () => {
        toggle();
        root.classList.add("theme-anim");
      });

      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${radius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 520,
              easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
              direction: isDark ? "reverse" : "normal",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        })
        .catch(() => {})
        .finally(() => {
          window.setTimeout(() => root.classList.remove("theme-anim"), 560);
        });
      return;
    }

    // Fallback: ease the colour change, dipping opacity at the midpoint so it
    // does not read as a hard cut.
    root.classList.add("theme-anim");
    window.setTimeout(() => root.classList.add("theme-fading"), 30);
    toggle();
    window.setTimeout(() => root.classList.remove("theme-fading"), 300);
    window.setTimeout(() => root.classList.remove("theme-anim"), 760);
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      aria-label={ready ? label : "Toggle theme"}
      title={label}
      className={cls}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={
              reduce ? false : { opacity: 0, scale: 0.6, rotate: isDark ? -40 : 40 }
            }
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={
              reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: isDark ? 40 : -40 }
            }
            transition={
              reduce
                ? { duration: 0 }
                : { type: "spring", stiffness: 420, damping: 26 }
            }
            className="absolute inset-0 flex items-center justify-center"
          >
            {isDark ? <Moon size={18} weight="fill" /> : <Sun size={18} weight="fill" />}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}
