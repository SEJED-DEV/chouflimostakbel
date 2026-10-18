import type { Metadata } from "next";
import Link from "next/link";
import Reveal, { Rule } from "@/components/Reveal";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import ScrubText from "@/components/ScrubText";
import Card from "@/components/SpotlightCard";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";

export const metadata: Metadata = {
  title: "Graduates",
  description:
    "University orientation for Tunisian high school graduates: admission scores, the official orientation guide, and opportunities in Tunisia and abroad.",
  alternates: { canonical: "/graduates" },
  openGraph: { url: "/graduates" },
};

export default function GraduatesPage() {
  return (
    <>
      <Hero
        image="/images/feedback-bg.jpg"
        size="page"
        eyebrow="Graduates"
        chunks={[{ t: "“What do you want to study after high school?”" }]}
        sub="This section is dedicated to graduates who do not know which path to follow. Not knowing the answer is okay."
      />

      {/* TOOLS */}
      <section className="bg-bg py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <Reveal>
            <h2 className="max-w-2xl text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
              We help you take <span className="text-gray">the first steps.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-gray-2">
              Choosing the most convenient path after graduating sounds
              challenging and a little confusing. One thing that confuses a lot
              of Tunisian graduates is how universities and colleges choose
              their students. We break it all down for you.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-5">
            <Reveal className="md:col-span-3" delay={0.05}>
              <Card className="h-full bg-ink" interactive={false}>
                <a
                  href="https://score.faccna.tn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full min-h-[280px] flex-col justify-between p-9"
                >
                  <div>
                    <p className="text-[13px] font-semibold text-blue">
                      Official calculator
                    </p>
                    <h3 className="mt-2 text-[30px] font-semibold tracking-[-0.02em] text-white">
                      University Admission Score
                    </h3>
                    <p className="mt-4 max-w-md text-[16px] leading-relaxed text-white/70">
                      A lot of students struggle to understand how to calculate
                      their orientation score, and it is different for each
                      division. Calculate yours with the official tool.
                    </p>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-1.5 text-[16px] font-medium text-blue">
                    score.faccna.tn
                    <ArrowUpRight
                      size={16}
                      weight="bold"
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </a>
              </Card>
            </Reveal>

            <Reveal delay={0.1}>
              <Card className="h-full">
                <a
                  href="https://www.orientation.tn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full min-h-[280px] flex-col justify-between p-9"
                >
                  <div>
                    <p className="text-[13px] font-semibold text-blue">
                      Program directory
                    </p>
                    <h3 className="mt-2 text-[24px] font-semibold tracking-[-0.02em] text-ink">
                      College Orientation Guide
                    </h3>
                    <p className="mt-4 text-[16px] leading-relaxed text-gray-2">
                      Once you know your score, explore every program that
                      matches your profile and interests.
                    </p>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-1.5 text-[16px] font-medium text-blue">
                    orientation.tn
                    <ArrowUpRight
                      size={16}
                      weight="bold"
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </a>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* MISSION - dark statement */}
      <section className="bg-ink py-28 text-white sm:py-36">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <Rule className="mb-12 !bg-white/20 max-w-3xl" />
          <ScrubText
            as="h2"
            text="Whether you stay in Tunisia or explore opportunities abroad, we walk with you through every first step."
            className="max-w-3xl text-[clamp(1.9rem,4.5vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white"
          />
          <Reveal delay={0.1}>
            <p className="mt-10 max-w-2xl text-[17px] leading-relaxed text-white/70">
              Choufli Mosta9bel provides teenagers with guidance, giving them
              the opportunity to express themselves and build the future they
              are most comfortable with. Your grades and what you love decide
              the offer, and we help you make the right decision.
            </p>
            <Link
              href="/divisions"
              className="group mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-[17px] font-medium text-ink transition-transform duration-300 hover:scale-[1.02]"
            >
              Review HS divisions
              <ArrowRight
                size={16}
                weight="bold"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </Reveal>
        </div>
      </section>

      <Contact
        title="Questions about university orientation?"
        note="Ask us anything you want to know about university orientation or career paths, and we will get back to you. Honest reviews are welcome too."
      />
    </>
  );
}
