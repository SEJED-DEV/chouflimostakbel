import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Reveal, { Rule } from "@/components/Reveal";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import ScrubText from "@/components/ScrubText";
import Card from "@/components/SpotlightCard";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero
        image="/images/hero-bg.jpg"
        eyebrow="Guidance for Tunisian youth"
        chunks={[
          { t: "Build a " },
          { t: "consistent future", accent: true },
          { t: ", no matter where you start." },
        ]}
        sub="Choufli Mosta9bel helps school dropouts, undecided students, and graduates find real, practical paths to a stable future."
        cta={{ label: "Find your path", href: "#paths" }}
      />

      {/* PATHS - light, system-like tiles */}
      <section id="paths" className="bg-bg py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <Reveal>
            <h2 className="max-w-2xl text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.03em] text-ink">
              Three audiences.{" "}
              <span className="text-gray">One mission.</span>
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
                      ATFP and second chances
                    </span>
                    <h3 className="mt-2 text-[30px] font-semibold tracking-[-0.02em] text-white">
                      School Dropout
                    </h3>
                    <p className="mt-3 max-w-md text-[16px] leading-relaxed text-white/80">
                      Discover ATFP programs and second chances. Dropping out is
                      not the end, it is the start of a new path.
                    </p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-[16px] font-medium text-white">
                      Explore
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
                        Before 2nd year
                      </p>
                      <h3 className="mt-2 text-[26px] font-semibold tracking-[-0.02em] text-ink">
                        HS Student
                      </h3>
                      <p className="mt-3 text-[16px] leading-relaxed text-gray-2">
                        Understand every division before choosing, with advice on
                        pros, cons, and major subjects.
                      </p>
                    </div>
                    <span className="mt-7 inline-flex items-center gap-1.5 text-[16px] font-medium text-blue">
                      Explore
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
                <Card className="h-full bg-ink" interactive={false}>
                  <Link
                    href="/graduates"
                    className="group flex h-full flex-col justify-between p-8"
                  >
                    <div>
                      <p className="text-[13px] font-semibold text-blue">
                        Tunisia and abroad
                      </p>
                      <h3 className="mt-2 text-[26px] font-semibold tracking-[-0.02em] text-white">
                        Graduate
                      </h3>
                      <p className="mt-3 text-[16px] leading-relaxed text-white/70">
                        Opportunities in Tunisia and abroad, based on what you
                        love and your grades.
                      </p>
                    </div>
                    <span className="mt-7 inline-flex items-center gap-1.5 text-[16px] font-medium text-blue">
                      Explore
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
      <section className="bg-ink py-28 text-white sm:py-36">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <Rule className="mb-12 !bg-white/20 max-w-3xl" />
          <ScrubText
            as="h2"
            text="“Where you find offers that ensure you a good future.”"
            className="max-w-3xl text-[clamp(1.9rem,4.5vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white"
          />
          <Reveal delay={0.1}>
            <p className="mt-10 max-w-2xl text-[18px] leading-relaxed text-white/70">
              Choufli Mosta9bel is where you will find solutions, helping you
              build a future to live individually and work with or without a
              Bac. We provide teenagers with guidance, giving them the
              opportunity to express themselves and build the future they are
              most comfortable with.
            </p>
            <Link
              href="/dropouts"
              className="group mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-[17px] font-medium text-ink transition-transform duration-300 hover:scale-[1.02]"
            >
              Start with the dropout guide
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
