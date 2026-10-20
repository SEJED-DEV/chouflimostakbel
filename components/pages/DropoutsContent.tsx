"use client";

import Icon from "@/components/Icons";
import Image from "next/image";
import Reveal, { Rule, ZoomFrame } from "@/components/Reveal";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import ScrubText from "@/components/ScrubText";
import AtfpCarousel from "@/components/AtfpPan";

import { useSlice } from "@/components/i18n/slice";
import { dropouts } from "@/components/i18n/dropouts";

export default function DropoutsContent() {
  const t = useSlice(dropouts);

  return (
    <>
      <Hero
        image="/images/welcome-bg.jpg"
        size="page"
        eyebrow={t.hero.eyebrow}
        chunks={t.hero.chunks}
        sub={t.hero.sub}
      />

      {/* GIVE YOURSELF ANOTHER CHANCE */}
      <section className="bg-bg py-24 sm:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 sm:px-8 lg:grid-cols-2">
          <div>
            <Reveal>
              <h2 className="text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
                {t.anotherChance.titleLead}{" "}
                <span className="text-gray">{t.anotherChance.titleAccent}</span>
              </h2>
              <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-gray-2">
                {t.anotherChance.body1}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-gray-2">
                {t.anotherChance.body2}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="card-soft relative overflow-hidden" style={{ borderRadius: "24px" }}>
              <ZoomFrame className="relative min-h-[340px]">
                <Image
                  src="/images/feedback-bg.jpg"
                  alt={t.anotherChance.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-8 pt-24">
                  <p className="max-w-sm text-[22px] font-medium leading-snug text-white">
                    {t.anotherChance.quote}
                  </p>
                </div>
              </ZoomFrame>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ATFP - native horizontal carousel */}
      <section className="bg-bg-alt py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <Reveal>
            <p className="text-[15px] font-medium text-blue">
              {t.atfp.agency}
            </p>
            <h2 className="mt-4 max-w-3xl text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
              {t.atfp.titleLead}{" "}
              <span className="text-gray">{t.atfp.titleAccent}</span>{" "}
              {t.atfp.titleTail}
            </h2>
          </Reveal>
        </div>
        <div className="mt-12">
          <AtfpCarousel levels={t.atfp.levels} fieldsLabel={t.atfp.fieldsLabel} />
        </div>
        <p className="mx-auto mt-4 max-w-6xl px-6 text-[14px] text-gray sm:px-8">
          {t.atfp.hint}
        </p>
      </section>

      {/* SECOND CHANCES - dark statement */}
      <section className="bg-surface py-24 text-white sm:py-32">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <p className="text-[15px] font-medium text-blue">{t.secondChance.kicker}</p>
          <ScrubText
            as="h2"
            text={t.secondChance.statement}
            className="mt-4 max-w-2xl text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white"
          />
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/70">
            {t.secondChance.body}
          </p>
        </div>
      </section>

      {/* HOW TO APPLY */}
      <section className="bg-bg py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <Reveal>
            <h2 className="text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.03em] text-ink">
              {t.apply.title}
            </h2>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-gray-2">
              {t.apply.sub}
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {t.apply.portals.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-soft card-soft-hover group flex h-full items-center justify-between gap-6 rounded-3xl bg-bg p-8"
                >
                  <div>
                    <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
                      {p.title}
                    </h3>
                    <p className="mt-1.5 text-[15px] text-gray">{p.domain}</p>
                  </div>
                  <Icon name="arrow-up-right"
                    size={24}
                    className="shrink-0 text-blue transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </Reveal>
            ))}
          </div>

          <Rule className="mt-16 max-w-4xl" />

          <ol className="mt-10 grid gap-x-14 gap-y-7 sm:grid-cols-2">
            {t.apply.steps.map((s, i) => (
              <Reveal key={s} delay={i * 0.04}>
                <li className="flex items-start gap-4 border-b border-sep pb-7">
                  <span className="font-mono text-[13px] font-medium text-gray">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[16px] leading-relaxed text-gray-2">
                    {s}
                  </span>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <Contact title={t.contact.title} note={t.contact.note} />
    </>
  );
}