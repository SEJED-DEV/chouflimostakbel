import type { Metadata } from "next";
import Reveal, { Rule } from "@/components/Reveal";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import ScrubText from "@/components/ScrubText";
import DivisionTabs from "@/components/DivisionTabs";

export const metadata: Metadata = {
  title: "HS Divisions",
  description:
    "Understand every Tunisian high school division before choosing: Sciences, Computer Science, Economics, Literature, and the 3rd year science tracks.",
  alternates: { canonical: "/divisions" },
  openGraph: { url: "/divisions" },
};

export default function DivisionsPage() {
  return (
    <>
      <Hero
        image="/images/questions-bg.jpg"
        size="page"
        eyebrow="HS divisions"
        chunks={[
          { t: "Being lost is totally " },
          { t: "normal", accent: true },
          { t: "." },
        ]}
        sub="This section is dedicated to students who do not know which division to choose. Here you will find advice and everything you need to know about every division."
      />

      {/* CHOOSE WISELY - intro, then segmented tabs */}
      <section className="bg-bg py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <ScrubText
            as="h2"
            text="Choose wisely."
            className="max-w-2xl text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.03em] text-ink"
          />
          <Rule className="mt-7 max-w-4xl" />
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-gray-2">
              In Tunisia the first year of high school is the same for every
              student. By the end of that year, students must make their first
              choice.
            </p>
          </Reveal>

          <div className="mt-12">
            <DivisionTabs />
          </div>
        </div>
      </section>

      <Contact
        title="Still unsure about your division?"
        note="Send us anything you want to know about choosing your division, and we will get back to you. Honest reviews are welcome too."
      />
    </>
  );
}
