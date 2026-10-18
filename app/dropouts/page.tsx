import type { Metadata } from "next";
import Image from "next/image";
import Reveal, { Rule, ZoomFrame } from "@/components/Reveal";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import ScrubText from "@/components/ScrubText";
import AtfpCarousel from "@/components/AtfpPan";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";

export const metadata: Metadata = {
  title: "School Dropouts",
  description:
    "ATFP programs and second chance schools for school dropouts in Tunisia: CC, CAP, BTP, BTS, and how to apply.",
  alternates: { canonical: "/dropouts" },
  openGraph: { url: "/dropouts" },
};

const levels = [
  {
    code: "CC",
    name: "Certificat de Compétence",
    body: "Teaches practical skills that could get you through life in the future.",
    fields:
      "Sewing, Arc welding, Auto-body prep, House wiring, Bricklaying, Wall Tiling, Baking, Barbering",
    duration: "3 to 6 months",
  },
  {
    code: "CAP",
    name: "Certificat d'Aptitude Professionnelle",
    body: "Creates certified, well-trained workers ready to make their first steps into work life.",
    fields:
      "Mechanical, Automotive, Electricity, Electronics, HVAC, Plumbing, Metalwork, Textile, Fashion, IT, Administration, Hospitality, Culinary, Beauty, Crafts",
    duration: "2 years",
  },
  {
    code: "BTP",
    name: "Brevet de Technicien Professionnel",
    body: "Creates well-trained technicians able to solve high-level technical problems and even lead a team.",
    fields:
      "IT, Electronics, Automotive Mechanics, Civil Engineering, Accounting, Logistics, Fashion, Hospitality",
    duration: "2 years",
  },
  {
    code: "BTS",
    name: "Brevet de Technicien Supérieur",
    body: "Bridges the gap between engineers and field workers, almost like going to college.",
    fields:
      "IT, Cybersecurity, Biomedical Electronics, Smart Industrial Automation, HVAC Engineering, Civil Architectural Drafting, Business Management, International Commerce, Logistics, Fashion Design, Upscale Hospitality",
    duration: "2 years",
  },
];

const steps = [
  "Access the portal online",
  "Create an account",
  "Fill the form: personal info, ID, contact, guardian info, academic background, choose nearby centers",
  "Check regularly to see if you got accepted",
  "Choose the course you want to follow",
  "Submit your physical file: school certificate, birth certificate, and more",
  "Pay the registration fees",
  "Show up, work hard, and secure a good future",
];

export default function DropoutsPage() {
  return (
    <>
      <Hero
        image="/images/welcome-bg.jpg"
        size="page"
        eyebrow="School dropouts"
        chunks={[
          { t: "Dropping out at 16 is not a burden. It is the sign of a " },
          { t: "new beginning", accent: true },
          { t: "." },
        ]}
        sub="This section is dedicated to students looking to build a future outside high school, through real vocational paths and second chance programs."
      />

      {/* GIVE YOURSELF ANOTHER CHANCE */}
      <section className="bg-bg py-24 sm:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 sm:px-8 lg:grid-cols-2">
          <div>
            <Reveal>
              <h2 className="text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
                Give yourself <span className="text-gray">another chance.</span>
              </h2>
              <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-gray-2">
                Dropping out often leads to unemployment among teens, but it
                does not mean you cannot build a consistent, stable future. A
                lot of people have incredible talents and are deeply creative.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-gray-2">
                Tunisia has real opportunities waiting for you. Through
                vocational training and second chance programs, you can build
                the future you deserve.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="card-soft relative overflow-hidden" style={{ borderRadius: "24px" }}>
              <ZoomFrame className="relative min-h-[340px]">
                <Image
                  src="/images/feedback-bg.jpg"
                  alt="Students building a new path"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-8 pt-24">
                  <p className="max-w-sm text-[22px] font-medium leading-snug text-white">
                    Dropping out is not the end, it is the start of a new path.
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
              Agence Tunisienne de la Formation Professionnelle
            </p>
            <h2 className="mt-4 max-w-3xl text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
              The safest option: a certified qualification with{" "}
              <span className="text-gray">real weight</span> in the job market.
            </h2>
          </Reveal>
        </div>
        <div className="mt-12">
          <AtfpCarousel levels={levels} />
        </div>
        <p className="mx-auto mt-4 max-w-6xl px-6 text-[14px] text-gray sm:px-8">
          Swipe to explore all four levels
        </p>
      </section>

      {/* SECOND CHANCES - dark statement */}
      <section className="bg-ink py-24 text-white sm:py-32">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <p className="text-[15px] font-medium text-blue">Second chances</p>
          <ScrubText
            as="h2"
            text="It is never too late to reintegrate."
            className="mt-4 max-w-2xl text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white"
          />
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/70">
            Some people may regret dropping out, thinking there is no way back.
            Thankfully, Tunisia&apos;s Ministry of Education gives any young
            dropout the chance to reintegrate in second chance schools. It does
            not necessarily let you pick up exactly where you left off, but it
            helps you feel integrated and build a path to a bright future.
          </p>
        </div>
      </section>

      {/* HOW TO APPLY */}
      <section className="bg-bg py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <Reveal>
            <h2 className="text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.03em] text-ink">
              How to apply.
            </h2>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-gray-2">
              Both official portals follow the same process from account
              creation to registration.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              {
                href: "https://www.atfp.tn",
                title: "ATFP Courses",
                domain: "takwin.atfp.tunis",
              },
              {
                href: "https://2emechance.education.tn/",
                title: "Second Chance Centers",
                domain: "2emechance.education.tn",
              },
            ].map((p, i) => (
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
                  <ArrowUpRight
                    size={24}
                    weight="bold"
                    className="shrink-0 text-blue transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </Reveal>
            ))}
          </div>

          <Rule className="mt-16 max-w-4xl" />

          <ol className="mt-10 grid gap-x-14 gap-y-7 sm:grid-cols-2">
            {steps.map((s, i) => (
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

      <Contact
        title="Questions about ATFP or second chances?"
        note="Send us anything you want to know about ATFP programs or second chance schools, and we will get back to you. Honest reviews are welcome too."
      />
    </>
  );
}
