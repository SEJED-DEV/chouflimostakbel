"use client";

import Reveal, { Rule } from "@/components/Reveal";
import Publisher from "@/components/Publisher";
import LegalText from "@/components/LegalText";
import { useLanguage } from "@/components/LanguageProvider";
import type { LegalDoc } from "@/components/i18n/legal";

/**
 * Renders one legal document.
 *
 * The two legal pages have the same shape, so they share this. The date is
 * formatted for the reader's language rather than written out three times.
 */

/** Built from parts so the day cannot shift with the reader's timezone. */
const UPDATED = new Date(2026, 9, 19);

export default function LegalDocument({ doc }: { doc: LegalDoc }) {
  const { lang } = useLanguage();
  const date = new Intl.DateTimeFormat(lang, { dateStyle: "long" }).format(UPDATED);

  return (
    <>
      <section className="bg-bg pt-36 pb-10 sm:pt-44">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <Reveal>
            <p className="text-[13px] font-semibold text-blue">{doc.eyebrow}</p>
            <h1 className="mt-3 text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
              {doc.title}
            </h1>
            <p className="mt-4 text-[16px] text-gray-2">
              {doc.updatedLabel}: {date}
            </p>
          </Reveal>
          <Rule className="mt-8" />
        </div>
      </section>

      <section className="bg-bg pb-24 sm:pb-32">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <div className="space-y-10 text-[17px] leading-relaxed text-gray-2">
            {doc.sections.map((section, i) => (
              <Reveal key={section.title} delay={i * 0.03}>
                <div>
                  <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
                    {section.title}
                  </h2>
                  {section.paragraphs.map((p, n) => (
                    <p key={n} className={n === 0 ? "mt-3" : "mt-3"}>
                      <LegalText text={p} />
                    </p>
                  ))}
                  {section.bullets && (
                    <ul className="mt-3 list-disc space-y-2 ps-5">
                      {section.bullets.map((b, n) => (
                        <li key={n}>
                          <LegalText text={b} />
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.publisher && (
                    <div className="mt-5">
                      <Publisher />
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
