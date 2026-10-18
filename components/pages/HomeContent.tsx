"use client";

import Link from "next/link";
import Image from "next/image";
import Reveal, { Rule } from "@/components/Reveal";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import ScrubText from "@/components/ScrubText";
import Card from "@/components/SpotlightCard";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { useSlice } from "@/components/i18n/slice";
import { home } from "@/components/i18n/home";

export default function HomeContent() {
  const t = useSlice(home);

  return (
    <>
      <Hero
        image="/images/hero-bg.jpg"
        eyebrow={t.hero.eyebrow}
        chunks={t.hero.chunks}
        sub={t.hero.sub}
        cta={{ label: t.hero.cta, href: "#paths" }}
      />

      {/* PATHS - light, system-like tiles */}
      <section id="paths" className="bg-bg py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <Reveal>
            <h2 className="max-w-2xl text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
              {t.paths.title}{" "}
              <span className="text-gray">{t.paths.titleAccent}</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-5">
            <Reveal className="md:col-span-3" delay={0.05}>
              <Card className="h-full">
                <Link
                  href="/dropouts"
                  className="group relative flex h-full min-h-[380px] flex-col justify-end"
                >
                  <Image
                    src="/images/welcome-bg.jpg"
                    alt=""
                    aria-hidden
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                  <div className="relative p-9">
                    <span className="text-[13px] font-semibold text-white/70">
                      {t.paths.dropouts.kicker}
                    </span>
                    <h3 className="mt-2 text-[30px] font-semibold tracking-[-0.02em] text-white">
                      {t.paths.dropouts.title}
                    </h3>
                    <p className="mt-3 max-w-md text-[16px] leading-relaxed text-white/80">
                      {t.paths.dropouts.body}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-[16px] font-medium text-white">
                      {t.paths.explore}
                      <ArrowRight
                        size={16}
                        weight="bold"
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              </Card>
            </Reveal>

            <div className="grid gap-6 md:col-span-2">
              <Reveal delay={0.1}>
                <Card className="h-full">
                  <Link
                    href="/divisions"
                    className="group flex h-full flex-col justify-between p-8"
                  >
                    <div>
                      <p className="text-[13px] font-semibold text-blue">
                        {t.paths.divisions.kicker}
                      </p>
                      <h3 className="mt-2 text-[26px] font-semibold tracking-[-0.02em] text-ink">
                        {t.paths.divisions.title}
                      </h3>
                      <p className="mt-3 text-[16px] leading-relaxed text-gray-2">
                        {t.paths.divisions.body}
                      </p>
                    </div>
                    <span className="mt-7 inline-flex items-center gap-1.5 text-[16px] font-medium text-blue">
                      {t.paths.explore}
                      <ArrowRight
                        size={16}
                        weight="bold"
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                </Card>
              </Reveal>

              <Reveal delay={0.15}>
                <Card className="h-full bg-surface" interactive={false}>
                  <Link
                    href="/graduates"
                    className="group flex h-full flex-col justify-between p-8"
                  >
                    <div>
                      <p className="text-[13px] font-semibold text-blue">
                        {t.paths.graduates.kicker}
                      </p>
                      <h3 className="mt-2 text-[26px] font-semibold tracking-[-0.02em] text-white">
                        {t.paths.graduates.title}
                      </h3>
                      <p className="mt-3 text-[16px] leading-relaxed text-white/70">
                        {t.paths.graduates.body}
                      </p>
                    </div>
                    <span className="mt-7 inline-flex items-center gap-1.5 text-[16px] font-medium text-blue">
                      {t.paths.explore}
                      <ArrowRight
                        size={16}
                        weight="bold"
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                </Card>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO - full-bleed dark, calm scrubbed statement */}
      <section className="bg-surface py-28 text-white sm:py-36">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <Rule className="mb-12 !bg-white/20 max-w-3xl" />
          <ScrubText
            as="h2"
            text={t.manifesto.quote}
            className="max-w-3xl text-[clamp(1.9rem,4.5vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white"
          />
          <Reveal delay={0.1}>
            <p className="mt-10 max-w-2xl text-[18px] leading-relaxed text-white/70">
              {t.manifesto.body}
            </p>
            <Link
              href="/dropouts"
              className="group mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-[17px] font-medium text-ink transition-transform duration-300 hover:scale-[1.02]"
            >
              {t.manifesto.cta}
              <ArrowRight
                size={16}
                weight="bold"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </Reveal>
        </div>
      </section>

      <Contact />
    </>
  );
}
