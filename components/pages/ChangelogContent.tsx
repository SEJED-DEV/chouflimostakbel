"use client";

import Reveal, { Rule } from "@/components/Reveal";
import Card from "@/components/SpotlightCard";
import { useSlice } from "@/components/i18n/slice";
import { changelog } from "@/components/i18n/changelog";
import ChangelogCommits from "@/components/ChangelogCommits";
import DeployStatusLine from "@/components/DeployStatus";
import PushOptIn from "@/components/PushOptIn";

export default function ChangelogContent() {
  const t = useSlice(changelog);

  return (
    <>
      {/* HEADER */}
      <section className="bg-bg pt-36 pb-10 sm:pt-44">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <Reveal>
            <p className="text-[13px] font-semibold text-blue">{t.header.eyebrow}</p>
            <h1 className="mt-3 text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
              {t.header.title} <span className="text-gray">{t.header.titleAccent}</span>
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-gray-2">
              {t.header.sub}
            </p>
            <DeployStatusLine />
            <PushOptIn className="mt-4" />
          </Reveal>
          <Rule className="mt-10" />
        </div>
      </section>

      {/* TIMELINE - newest release first, a quiet version column beside each card */}
      <section className="bg-bg pb-16 sm:pb-24">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <ol className="grid gap-10 sm:gap-12">
            {t.entries.map((e, i) => (
              <li
                key={e.version}
                className="grid gap-5 border-t border-sep pt-10 sm:grid-cols-[8.5rem_1fr] sm:gap-8 sm:pt-12"
              >
                <Reveal delay={i * 0.05}>
                  <h2 className="font-mono text-[19px] font-semibold tracking-[-0.01em] text-ink">
                    {e.version}
                  </h2>
                  <p className="mt-2 text-[14px] text-gray">{e.date}</p>
                  {i === 0 && (
                    <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-bg-alt px-3 py-1.5 text-[12px] font-medium text-blue">
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-blue" />
                      {t.latest}
                    </span>
                  )}
                </Reveal>

                <Reveal delay={i * 0.05 + 0.06}>
                  <Card interactive={false} className="p-7 sm:p-8">
                    <p className="text-[19px] leading-relaxed text-ink">{e.summary}</p>

                    <p className="mt-6 text-[13px] font-semibold text-blue">
                      {t.changesLabel}
                    </p>
                    <ul className="mt-4 grid gap-3">
                      {e.changes.map((c) => (
                        <li key={c} className="flex items-start gap-3">
                          <span
                            aria-hidden
                            className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sep"
                          />
                          <span className="text-[16px] leading-relaxed text-gray-2">
                            {c}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <ChangelogCommits entry={e} label={t.commitsLabel} />
                  </Card>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* NOTE */}
      <section className="bg-bg pb-24 sm:pb-32">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <Rule className="max-w-xl" />
          <Reveal delay={0.1}>
            <h2 className="mt-10 text-[22px] font-semibold tracking-[-0.02em] text-ink">
              {t.note.title}
            </h2>
            <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-gray-2">
              {t.note.body}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}