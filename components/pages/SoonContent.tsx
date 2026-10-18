"use client";

import Link from "next/link";
import Reveal, { Rule } from "@/components/Reveal";
import Card from "@/components/SpotlightCard";
import HelpPopup from "@/components/HelpPopup";
import { useSlice } from "@/components/i18n/slice";
import { soon } from "@/components/i18n/soon";
import { REPO_URL } from "@/lib/site";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";

/**
 * The roadmap, published.
 *
 * Nothing here is live yet, and the page says so. It exists so the plan is
 * readable by anyone, not just the people building it - and so the "would you
 * help build this" question has somewhere to point.
 */
export default function SoonContent() {
  const t = useSlice(soon);

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="bg-bg pt-36 pb-16 sm:pt-44 sm:pb-24">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <Reveal>
            <p className="text-[13px] font-semibold text-blue">{t.hero.eyebrow}</p>
            <h1 className="mt-3 text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
              {t.hero.title}{" "}
              <span className="text-gray">{t.hero.titleAccent}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-gray-2">
              {t.hero.sub}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#phases"
                className="inline-flex items-center gap-2 rounded-full bg-blue px-7 py-3 text-[17px] font-medium text-white shadow-[0_8px_24px_rgba(0,113,227,0.28)] transition-all duration-300 hover:bg-blue-hi hover:scale-[1.03]"
              >
                {t.hero.cta}
                <ArrowRight size={16} weight="bold" />
              </a>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-bg-alt px-6 py-3 text-[17px] font-medium text-ink transition-colors duration-300 hover:bg-sep/60"
              >
                {t.hero.ctaSecondary}
                <ArrowUpRight
                  size={15}
                  weight="bold"
                  className="text-gray-2"
                />
              </a>
            </div>
          </Reveal>
          <Rule className="mt-12 max-w-2xl" />
        </div>
      </section>

      {/* ---------------- INTRO ---------------- */}
      <section className="bg-bg pb-20 sm:pb-28">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <Reveal>
            <h2 className="text-[clamp(1.6rem,4vw,2.4rem)] font-semibold tracking-[-0.025em] text-ink">
              {t.intro.title}
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-gray-2">
              {t.intro.body}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- OPEN QUESTIONS ---------------- */}
      <section className="bg-bg pb-20 sm:pb-28">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <Reveal>
            <h2 className="text-[clamp(1.6rem,4vw,2.4rem)] font-semibold tracking-[-0.025em] text-ink">
              {t.questions.title}
            </h2>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-gray-2">
              {t.questions.sub}
            </p>
          </Reveal>

          {/* What has already been settled - kept visible, not buried. */}
          <Reveal delay={0.05}>
            <div className="mt-9 rounded-2xl border border-blue/25 bg-blue/[0.06] p-6 sm:p-7">
              <span className="inline-flex items-center rounded-full bg-blue/10 px-3 py-1 text-[12px] font-semibold text-blue">
                {t.questions.decided.label}
              </span>
              <h3 className="mt-3.5 text-[20px] font-semibold tracking-[-0.02em] text-ink">
                {t.questions.decided.title}
              </h3>
              <p className="mt-2.5 max-w-2xl text-[16px] leading-relaxed text-gray-2">
                {t.questions.decided.body}
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {t.questions.items.map((item, i) => (
              <Reveal key={item.q} delay={i * 0.05}>
                <Card className="h-full p-7" interactive={false}>
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue/10 text-[13px] font-semibold text-blue">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[19px] font-semibold tracking-[-0.02em] text-ink">
                        {item.q}
                      </h3>
                      <p className="mt-2.5 text-[15.5px] leading-relaxed text-gray-2">
                        {item.why}
                      </p>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- STACK ---------------- */}
      <section className="bg-bg-alt/50 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <Reveal>
            <h2 className="text-[clamp(1.6rem,4vw,2.4rem)] font-semibold tracking-[-0.025em] text-ink">
              {t.stack.title}
            </h2>
            {t.stack.sub && (
              <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-gray-2">
                {t.stack.sub}
              </p>
            )}
          </Reveal>

          <dl className="mt-9 divide-y divide-sep border-y border-sep">
            {t.stack.items.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.03}>
                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-8">
                  <dt className="text-[14px] font-medium text-gray sm:w-48 sm:shrink-0">
                    {s.label}
                  </dt>
                  <dd className="text-[16.5px] leading-relaxed text-ink">{s.value}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------- PHASES ---------------- */}
      <section id="phases" className="scroll-mt-28 bg-bg py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <Reveal>
            <h2 className="text-[clamp(1.6rem,4vw,2.4rem)] font-semibold tracking-[-0.025em] text-ink">
              {t.phases.title}
            </h2>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-gray-2">
              {t.phases.sub}
            </p>
          </Reveal>

          <ol className="mt-12 space-y-5">
            {t.phases.items.map((p, i) => (
              <Reveal key={p.n} delay={0.04}>
                <li>
                  <Card className="p-7 sm:p-8" interactive={false}>
                    <div className="flex flex-col gap-5 sm:flex-row sm:gap-7">
                      <div className="flex items-center gap-3 sm:w-40 sm:shrink-0">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-[15px] font-semibold text-white">
                          {p.n}
                        </span>
                        <span className="text-[18px] font-semibold tracking-[-0.02em] text-ink sm:hidden">
                          {p.name}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="hidden text-[21px] font-semibold tracking-[-0.02em] text-ink sm:block">
                          {p.name}
                        </h3>
                        <p className="mt-2 text-[16px] leading-relaxed text-gray-2 sm:mt-0">
                          {p.body}
                        </p>
                        <ul className="mt-4 flex flex-wrap gap-2">
                          {p.points.map((point) => (
                            <li
                              key={point}
                              className="rounded-full bg-bg-alt px-3 py-1.5 text-[13px] text-gray-2"
                            >
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- ALGORITHM ---------------- */}
      <section className="bg-surface py-20 text-white sm:py-28">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <Reveal>
            <p className="text-[13px] font-semibold text-blue">
              {t.algorithm.title}
            </p>
            <h2 className="mt-3 text-[clamp(1.6rem,4vw,2.4rem)] font-semibold leading-[1.15] tracking-[-0.025em] text-white">
              {t.algorithm.sub}
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {t.algorithm.steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.05}>
                <div className="h-full rounded-2xl bg-white/[0.06] p-6">
                  <span className="text-[12px] font-semibold tracking-[0.08em] text-white/40 uppercase">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2.5 text-[19px] font-semibold tracking-[-0.02em] text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-[15.5px] leading-relaxed text-white/70">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* The formula, as a readable block rather than an image. */}
          <Reveal delay={0.1}>
            <div className="mt-10 rounded-2xl bg-white/[0.06] p-6 sm:p-7">
              <p className="text-[12px] font-semibold tracking-[0.08em] text-white/40 uppercase">
                {t.algorithm.formulaLabel}
              </p>
              <pre className="mt-4 overflow-x-auto text-[14px] leading-relaxed whitespace-pre text-white/85 sm:text-[15px]">
                {t.algorithm.formula.join("\n")}
              </pre>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-6 rounded-2xl border border-white/10 p-6 sm:p-7">
              <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-white">
                {t.algorithm.guardrails.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {t.algorithm.guardrails.items.map((g) => (
                  <li
                    key={g}
                    className="flex items-start gap-3 text-[15.5px] leading-relaxed text-white/70"
                  >
                    <span
                      aria-hidden
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue"
                    />
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- RISKS ---------------- */}
      <section className="bg-bg py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <Reveal>
            <h2 className="text-[clamp(1.6rem,4vw,2.4rem)] font-semibold tracking-[-0.025em] text-ink">
              {t.risks.title}
            </h2>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-gray-2">
              {t.risks.sub}
            </p>
          </Reveal>

          <div className="mt-10 divide-y divide-sep border-y border-sep">
            {t.risks.items.map((r, i) => (
              <Reveal key={r.risk} delay={i * 0.03}>
                <div className="grid gap-2 py-5 sm:grid-cols-2 sm:gap-8">
                  <p className="text-[16px] font-medium text-ink">{r.risk}</p>
                  <p className="text-[15.5px] leading-relaxed text-gray-2">
                    {r.mitigation}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CONTRIBUTE ---------------- */}
      <section className="bg-bg pb-24 sm:pb-32">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <Rule />
          <Reveal delay={0.1}>
            <h2 className="mt-12 text-[clamp(1.6rem,4vw,2.4rem)] font-semibold tracking-[-0.025em] text-ink">
              {t.contribute.title}
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-gray-2">
              {t.contribute.body}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-blue px-6 py-3 text-[16px] font-medium text-white shadow-[0_8px_24px_rgba(0,113,227,0.28)] transition-all duration-300 hover:bg-blue-hi"
              >
                {t.contribute.repoCta}
                <ArrowUpRight size={15} weight="bold" />
              </a>
              <a
                href={`${REPO_URL}/issues`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-bg-alt px-6 py-3 text-[16px] font-medium text-ink transition-colors duration-300 hover:bg-sep/60"
              >
                {t.contribute.issuesCta}
                <ArrowUpRight size={15} weight="bold" className="text-gray-2" />
              </a>
            </div>

            <p className="mt-8 text-[14px] leading-relaxed text-gray">
              {t.contribute.note}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Asked once, only to people who came here to read the plan. */}
      <HelpPopup />
    </>
  );
}
