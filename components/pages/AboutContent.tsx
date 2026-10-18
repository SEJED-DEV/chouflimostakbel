"use client";

import Reveal, { Rule } from "@/components/Reveal";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Card from "@/components/SpotlightCard";
import { MailIcon } from "@/components/SiteIcons";
import { site } from "@/lib/site";
import { useSlice } from "@/components/i18n/slice";
import { about } from "@/components/i18n/about";

export default function AboutContent() {
  const t = useSlice(about);

  return (
    <>
      <Hero
        image="/images/welcome-bg.jpg"
        size="page"
        eyebrow={t.hero.eyebrow}
        chunks={t.hero.chunks}
        sub={t.hero.sub}
      />

      <section className="bg-bg py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="grid gap-14 lg:grid-cols-2">
            <div>
              <Reveal>
                <h2 className="text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
                  {t.who.title}
                </h2>
                <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-gray-2">
                  {t.who.p1}
                </p>
                <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-gray-2">
                  {t.who.p2}
                </p>
              </Reveal>
            </div>

            <div className="grid gap-6">
              {t.values.map((v, i) => (
                <Reveal key={v.title} delay={i * 0.08}>
                  <Card className="p-7" interactive={false}>
                    <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">
                      {v.title}
                    </h3>
                    <p className="mt-2.5 text-[16px] leading-relaxed text-gray-2">
                      {v.body}
                    </p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>

          <Rule className="mt-20 max-w-4xl" />

          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[16px] text-gray-2">
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-2 transition-colors hover:text-blue"
              >
                <MailIcon size={18} className="text-blue" />
                {t.contactLine.email}
              </a>
              <span>{t.contactLine.madeIn}</span>
            </div>
          </Reveal>
        </div>
      </section>

      <div id="contact" className="scroll-mt-28">
        <Contact title={t.contactTitle} note={t.contactNote} />
      </div>
    </>
  );
}
