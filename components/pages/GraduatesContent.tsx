"use client";

import Link from "next/link";
import Reveal, { Rule } from "@/components/Reveal";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import ScrubText from "@/components/ScrubText";
import Card from "@/components/SpotlightCard";
import ScoreCalculator from "@/components/ScoreCalculator";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { useSlice } from "@/components/i18n/slice";
import { graduates } from "@/components/i18n/graduates";

export default function GraduatesContent() {
  const t = useSlice(graduates);

  return (
    <>
      <Hero
        image="/images/feedback-bg.jpg"
        size="page"
        eyebrow={t.hero.eyebrow}
        chunks={t.hero.chunks}
        sub={t.hero.sub}
      />

      {/* TOOLS */}
      <section className="bg-bg py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <Reveal>
            <h2 className="max-w-2xl text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
              {t.tools.title}{" "}
              <span className="text-gray">{t.tools.titleAccent}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-gray-2">
              {t.tools.body}
            </p>
          </Reveal>

          {/* The calculator is a real tool: give it the full width. */}
          <Reveal delay={0.05}>
            <div className="mt-14">
              <ScoreCalculator />
            </div>
          </Reveal>

          {/* Official portal - full width, so it reads as a destination
              rather than a leftover column. */}
          <Reveal delay={0.1}>
            <div className="mt-6">
              <Card interactive={false}>
                <a
                  href="https://www.orientation.tn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:gap-8 sm:p-9"
                >
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-blue">
                      {t.directory.kicker}
                    </p>
                    <h3 className="mt-2 text-[24px] font-semibold tracking-[-0.02em] text-ink sm:text-[28px]">
                      {t.directory.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-gray-2">
                      {t.directory.body}
                    </p>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-bg-alt px-5 py-3 text-[15px] font-medium text-blue transition-colors duration-300 group-hover:bg-blue group-hover:text-white">
                    {t.directory.link}
                    <ArrowUpRight
                      size={16}
                      weight="bold"
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </a>
              </Card>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MISSION - dark statement */}
      <section className="bg-ink py-28 text-white sm:py-36">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <Rule className="mb-12 !bg-white/20 max-w-3xl" />
          <ScrubText
            as="h2"
            text={t.mission.quote}
            className="max-w-3xl text-[clamp(1.9rem,4.5vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white"
          />
          <Reveal delay={0.1}>
            <p className="mt-10 max-w-2xl text-[17px] leading-relaxed text-white/70">
              {t.mission.body}
            </p>
            <Link
              href="/divisions"
              className="group mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-[17px] font-medium text-ink transition-transform duration-300 hover:scale-[1.02]"
            >
              {t.mission.cta}
              <ArrowRight
                size={16}
                weight="bold"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </Reveal>
        </div>
      </section>

      <Contact title={t.contact.title} note={t.contact.note} />
    </>
  );
}