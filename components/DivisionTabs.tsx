"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check } from "@phosphor-icons/react/dist/ssr/Check";
import { Minus } from "@phosphor-icons/react/dist/ssr/Minus";
import Card from "./SpotlightCard";
import type { DivisionTabsCopy } from "./i18n/divisions";

/**
 * Pure renderer: every string - tab labels, intros, division names, pros, cons,
 * subjects - arrives through `data` from the divisions slice, so switching the
 * language re-renders the whole control in place.
 */
export default function DivisionTabs({ data }: { data: DivisionTabsCopy }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const tabs = data.tabs;
  const tab = tabs[active];

  return (
    <div>
      {/* iOS segmented control */}
      <div
        role="tablist"
        aria-label={data.ariaLabel}
        className="seg-track inline-flex"
      >
        {tabs.map((t, i) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className="relative rounded-[7px] px-7 py-2 text-[14px] font-medium transition-colors"
          >
            {i === active && (
              <motion.span
                layoutId="seg-pill"
                className="absolute inset-0 rounded-[7px] bg-bg"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.06)" }}
                transition={
                  reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }
                }
              />
            )}
            <span
              className={`relative ${
                i === active ? "text-ink" : "text-gray-2"
              }`}
            >
              {t.label}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab.id}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-gray-2">
            {tab.intro}
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {tab.items.map((d, i) => (
              <motion.div
                key={d.name}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.05 + i * 0.07,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="h-full"
              >
                <Card className="flex h-full flex-col p-8">
                  <h3 className="text-[24px] font-semibold tracking-[-0.02em] text-ink">
                    {d.name}
                  </h3>
                  <p className="mt-3 text-[16px] leading-relaxed text-gray-2">
                    {d.tagline}
                  </p>

                  <div className="mt-7 grid gap-7 sm:grid-cols-2">
                    <div>
                      <h4 className="text-[13px] font-semibold text-ink">
                        {data.prosLabel}
                      </h4>
                      <ul className="mt-3 space-y-2.5">
                        {d.pros.map((p) => (
                          <li key={p} className="flex items-start gap-2.5">
                            <Check
                              size={15}
                              weight="bold"
                              className="mt-1 shrink-0 text-blue"
                            />
                            <span className="text-[14.5px] leading-snug text-gray-2">
                              {p}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-ink">
                        {data.consLabel}
                      </h4>
                      <ul className="mt-3 space-y-2.5">
                        {d.cons.map((c) => (
                          <li key={c} className="flex items-start gap-2.5">
                            <Minus
                              size={15}
                              weight="bold"
                              className="mt-1 shrink-0 text-gray"
                            />
                            <span className="text-[14.5px] leading-snug text-gray-2">
                              {c}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-7 border-t border-sep pt-5">
                    <h4 className="text-[13px] font-semibold text-ink">
                      {data.subjectsLabel}
                    </h4>
                    <ul className="mt-3.5 flex flex-wrap gap-2">
                      {d.subjects.map((s) => (
                        <li
                          key={s}
                          className="rounded-full bg-bg-alt px-3 py-1.5 text-[13px] font-medium text-gray-2"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
