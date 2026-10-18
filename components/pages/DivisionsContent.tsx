"use client";

import Reveal, { Rule } from "@/components/Reveal";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import ScrubText from "@/components/ScrubText";
import DivisionTabs from "@/components/DivisionTabs";
import { useSlice } from "@/components/i18n/slice";
import { divisions } from "@/components/i18n/divisions";

export default function DivisionsContent() {
  const t = useSlice(divisions);

  return (
    <>
      <Hero
        image="/images/questions-bg.jpg"
        size="page"
        eyebrow={t.hero.eyebrow}
        chunks={t.hero.chunks}
        sub={t.hero.sub}
      />

      {/* CHOOSE WISELY - intro, then segmented tabs */}
      <section className="bg-bg py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <ScrubText
            as="h2"
            text={t.chooser.title}
            className="max-w-2xl text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.03em] text-ink"
          />
          <Rule className="mt-7 max-w-4xl" />
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-gray-2">
              {t.chooser.body}
            </p>
          </Reveal>

          <div className="mt-12">
            <DivisionTabs data={t.chooser} />
          </div>
        </div>
      </section>

      <Contact title={t.contact.title} note={t.contact.note} />
    </>
  );
}