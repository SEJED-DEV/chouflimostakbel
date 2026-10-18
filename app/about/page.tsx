import type { Metadata } from "next";
import Reveal, { Rule } from "@/components/Reveal";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Card from "@/components/SpotlightCard";
import { MailIcon } from "@/components/SiteIcons";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Choufli Mosta9bel is a Tunisian guidance project helping dropouts, undecided students, and graduates find real, practical paths forward.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};

const values = [
  {
    title: "Real paths, not platitudes",
    body: "Every program, score tool, and division we point to is a concrete next step you can actually take - not vague encouragement.",
  },
  {
    title: "Honest guidance",
    body: "We say what is hard as well as what is hopeful. Pros come with cons, and choices come with tradeoffs.",
  },
  {
    title: "For everyone's starting point",
    body: "With or without a Bac, in school or out of it, staying in Tunisia or going abroad - there is a path worth building.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Hero
        image="/images/welcome-bg.jpg"
        size="page"
        eyebrow="About Choufli Mosta9bel"
        chunks={[{ t: "We help you build the " }, { t: "future you choose", accent: true }, { t: "." }]}
        sub="A guidance project for Tunisian youth - helping dropouts, undecided students, and graduates find real, practical paths to a stable future."
      />

      <section className="bg-bg py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="grid gap-14 lg:grid-cols-2">
            <div>
              <Reveal>
                <h2 className="text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
                  Who we are.
                </h2>
                <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-gray-2">
                  Choufli Mosta9bel means "look to your future." We are a free
                  guidance resource built for the moments when the next step is
                  unclear: choosing a high school division, restarting after
                  dropping out, or picking a path after the Bac.
                </p>
                <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-gray-2">
                  We gather the real options - ATFP certifications, second
                  chance schools, division breakdowns, and official score tools
                  - and lay them out honestly so you can decide with confidence.
                </p>
              </Reveal>
            </div>

            <div className="grid gap-6">
              {values.map((v, i) => (
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
              <span className="flex items-center gap-2">
                <MailIcon size={18} className="text-blue" />
                contact@chouflimostakbel.tn
              </span>
              <span>Made in Tunisia.</span>
            </div>
          </Reveal>
        </div>
      </section>

      <div id="contact" className="scroll-mt-28">
        <Contact
          title="Get in touch."
          note="Send us anything you want to know about programs, divisions, or next steps - and we will get back to you. Honest reviews are welcome too."
        />
      </div>
    </>
  );
}
