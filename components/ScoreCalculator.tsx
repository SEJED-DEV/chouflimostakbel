"use client";

import Icon from "@/components/Icons";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import {
  SECTIONS,
  SECTION_ORDER,
  computeScore,
  mention,
  needsSessionControle,
  SCORE_GUIDE_YEAR,
  GUIDE_URL,
  type SectionId,
} from "@/lib/scoring";
import { useT } from "@/components/LanguageProvider";

const MAX = 20;

/**
 * Reference orientation-score calculator.
 *
 * Mobile-first: one column at every width, so nothing scrolls sideways or
 * gets squeezed. One focal number (FG), everything else subordinate. The
 * working is tucked behind a disclosure, so students who just want their
 * score see only the score.
 *
 * Implements the Ministry's published global formula. NOT an official tool -
 * the Ministry publishes a PDF and runs no calculator of its own. Per-filière
 * thresholds are deliberately omitted; they are republished yearly and stale
 * thresholds are worse than none.
 */
export default function ScoreCalculator() {
  const { t, sectionName, subjectName } = useT();
  const c = t.graduates.calc;
  const reduce = useReducedMotion();

  const [section, setSection] = useState<SectionId>("math");
  const [average, setAverage] = useState("");
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [showWorking, setShowWorking] = useState(false);

  const def = SECTIONS[section];

  const avgNum = average.trim() === "" ? null : Number(average);
  const avgValid =
    avgNum !== null && !Number.isNaN(avgNum) && avgNum >= 0 && avgNum <= MAX;

  const numeric = useMemo(() => {
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(grades)) {
      if (v.trim() === "") continue;
      const n = Number(v);
      if (!Number.isNaN(n)) out[k] = n;
    }
    return out;
  }, [grades]);

  const result = useMemo(
    () => computeScore(section, avgValid ? avgNum : null, numeric),
    [section, avgValid, avgNum, numeric]
  );

  const band = avgValid ? mention(avgNum as number) : null;
  const controle = needsSessionControle(avgValid ? avgNum : null);

  function pickSection(id: SectionId) {
    setSection(id);
    const keep: Record<string, string> = {};
    for (const key of SECTIONS[id].inputs) {
      if (grades[key] !== undefined) keep[key] = grades[key];
    }
    setGrades(keep);
  }

  const hasAnyInput = avgValid || Object.keys(numeric).length > 0;

  const terms = def.terms.map((t) => {
    const g = numeric[t.subject];
    return {
      ...t,
      contribution: g === undefined ? null : Math.round(t.coefficient * g * 1000) / 1000,
    };
  });
  const mgPart =
    avgValid && result.complete
      ? Math.round(def.mgCoefficient * (avgNum as number) * 1000) / 1000
      : null;

  return (
    <div className="rounded-3xl bg-bg-alt/70 p-4 sm:p-5">
      {/* ---------- section ---------- */}
      <fieldset>
        <legend className="px-1 text-[13px] font-semibold text-ink">
          {c.yourSection}
        </legend>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {SECTION_ORDER.map((id) => {
            const active = section === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => pickSection(id)}
                aria-pressed={active}
                className={`rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 ${
                  active
                    ? "bg-surface text-white"
                    : "bg-bg text-gray-2 hover:text-ink"
                }`}
              >
                {sectionName(SECTIONS[id])}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* ---------- the number ---------- */}
      <div className="mt-5 rounded-2xl bg-bg px-5 py-6 text-center">
        <p className="text-[11px] font-semibold tracking-[0.07em] text-gray-2 uppercase">
          {c.resultLabel}
        </p>

        <motion.p
          key={result.complete ? result.fg : "empty"}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className={`mt-2 text-[clamp(2.6rem,11vw,4rem)] leading-none font-semibold tabular-nums tracking-[-0.04em] ${
            result.complete ? "text-ink" : "text-gray/40"
          }`}
        >
          {result.complete ? result.fg.toFixed(3) : "--"}
        </motion.p>

        {result.complete ? (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
            {band && (
              <span className="rounded-full bg-blue/10 px-3 py-1 text-[12px] font-medium text-blue">
                {band}
              </span>
            )}
            <span className="text-[13px] text-gray-2">
              <span className="font-medium text-ink tabular-nums">
                {result.fgWithBonus.toFixed(3)}
              </span>{" "}
              {c.bonusLabel}
            </span>
          </div>
        ) : (
          <p className="mt-3 text-[13px] text-gray">{c.incomplete}</p>
        )}
      </div>

      {/* ---------- inputs ---------- */}
      <div className="mt-5 space-y-5">
        <div>
          <label htmlFor="calc-avg" className="px-1 text-[13px] font-semibold text-ink">
            {c.averageLabel}
          </label>
          <p className="mt-0.5 px-1 text-[12px] text-gray">{c.averageHelp}</p>
          <div className="relative mt-2">
            <input
              id="calc-avg"
              type="number"
              inputMode="decimal"
              min={0}
              max={MAX}
              step={0.01}
              value={average}
              onChange={(e) => setAverage(e.target.value)}
              placeholder="12.50"
              className="input-ios pr-14 text-center text-[20px] font-semibold"
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[15px] text-gray">
              /{MAX}
            </span>
          </div>
          {average.trim() !== "" && !avgValid && (
            <p className="mt-1.5 px-1 text-[12px] text-blue">{c.rangeError}</p>
          )}
          {controle && (
            <p className="mt-2 px-1 text-[12px] leading-relaxed text-gray-2">
              {c.controleHint}
            </p>
          )}
        </div>

        <fieldset>
          <legend className="px-1 text-[13px] font-semibold text-ink">
            {c.marksLabel}
          </legend>
          <div className="mt-2 space-y-2">
            {def.inputs.map((key) => {
              const term = def.terms.find((x) => x.subject === key);
              const value = grades[key] ?? "";
              const invalid =
                value.trim() !== "" &&
                (Number(value) < 0 || Number(value) > MAX || Number.isNaN(Number(value)));
              return (
                <div
                  key={key}
                  className="flex items-center gap-3 rounded-xl bg-bg px-3.5 py-2"
                >
                  <label
                    htmlFor={`calc-${key}`}
                    className="flex min-w-0 flex-1 items-baseline gap-1.5 text-[14px] font-medium text-ink"
                  >
                    <span className="truncate">{subjectName(key)}</span>
                    {term && (
                      <span className="shrink-0 text-[11px] text-gray">
                        ×{term.coefficient}
                      </span>
                    )}
                  </label>
                  <input
                    id={`calc-${key}`}
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={MAX}
                    step={0.01}
                    value={value}
                    onChange={(e) => setGrades((g) => ({ ...g, [key]: e.target.value }))}
                    placeholder="--"
                    aria-invalid={invalid}
                    className={`w-[72px] shrink-0 rounded-lg bg-bg-alt py-2 text-center text-[16px] font-medium tabular-nums outline-none transition-shadow ${
                      invalid
                        ? "shadow-[inset_0_0_0_1.5px_var(--color-blue)]"
                        : "focus:shadow-[inset_0_0_0_1.5px_var(--color-blue)]"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </fieldset>

        {hasAnyInput && (
          <button
            type="button"
            onClick={() => {
              setGrades({});
              setAverage("");
            }}
            className="px-1 text-[13px] font-medium text-gray transition-colors hover:text-blue"
          >
            {c.clear}
          </button>
        )}
      </div>

      {/* ---------- working (collapsed) ---------- */}
      <div className="mt-5 border-t border-sep pt-4">
        <button
          type="button"
          onClick={() => setShowWorking((s) => !s)}
          aria-expanded={showWorking}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <span className="text-[13px] font-semibold text-ink">{c.formulaLabel}</span>
          <Icon name="caret-down"
            size={14}
            className={`shrink-0 text-gray transition-transform duration-300 ${
              showWorking ? "rotate-180" : ""
            }`}
          />
        </button>

        <motion.div
          initial={false}
          animate={{ height: showWorking ? "auto" : 0, opacity: showWorking ? 1 : 0 }}
          transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
          className="overflow-hidden"
        >
          <div className="pt-3.5">
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-3 text-[13px]">
                <span className="text-gray-2">
                  {def.mgCoefficient} × {c.averageLabel}
                </span>
                <span className="font-medium text-ink tabular-nums">
                  {mgPart !== null ? mgPart.toFixed(3) : "--"}
                </span>
              </div>
              {terms.map((term) => (
                <div
                  key={term.subject}
                  className="flex items-baseline justify-between gap-3 text-[13px]"
                >
                  <span className="text-gray-2">
                    {term.coefficient} × {subjectName(term.subject)}
                  </span>
                  <span
                    className={`font-medium tabular-nums ${
                      term.contribution === null ? "text-gray/50" : "text-ink"
                    }`}
                  >
                    {term.contribution !== null ? term.contribution.toFixed(3) : "--"}
                  </span>
                </div>
              ))}
              <div className="mt-2 flex items-baseline justify-between gap-3 border-t border-sep pt-2 text-[13px]">
                <span className="font-semibold text-ink">FG</span>
                <span
                  className={`font-semibold tabular-nums ${
                    result.complete ? "text-blue" : "text-gray/50"
                  }`}
                >
                  {result.complete ? result.fg.toFixed(3) : "--"}
                </span>
              </div>
            </div>

            <p className="mt-4 text-[11.5px] leading-relaxed text-gray">
              {c.disclaimer}{" "}
              <a
                href={GUIDE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue underline underline-offset-2"
              >
                {c.guideLink}
              </a>{" "}
              ({SCORE_GUIDE_YEAR}).
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
