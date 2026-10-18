"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import Kinetic, { type HeroChunk } from "./Kinetic";

/**
 * Typographic hero where the headline IS the image: the page photo shows
 * through the letterforms via background-clip:text (see .hero-mask). Pristine
 * white space, one blue pill, no separate photo block. Confident, keynote-
 * grade, unmistakably designed rather than a stock banner.
 */
export default function Hero({
  eyebrow,
  chunks,
  sub,
  cta,
  image,
  size = "home",
}: {
  eyebrow: string;
  chunks: HeroChunk[];
  sub: string;
  cta?: { label: string; href: string };
  image: string;
  size?: "home" | "page";
}) {
  const reduce = useReducedMotion();
  const tall = size === "home";
  const headlineSize = tall
    ? "text-[clamp(3rem,9.5vw,7rem)]"
    : "text-[clamp(2.7rem,7.5vw,5.5rem)]";

  return (
    <section
      className={`relative overflow-hidden bg-bg ${
        tall ? "pt-40 pb-20 sm:pt-48" : "pt-36 pb-16 sm:pt-44"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        {/* Eyebrow as a quiet pill */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-bg-alt px-4 py-1.5 text-[13px] font-medium tracking-[-0.01em] text-gray-2">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-blue" />
            {eyebrow}
          </span>
        </motion.div>

        {/* The headline, filled with the photo */}
        <div
          className={`mx-auto mt-8 text-center ${tall ? "max-w-5xl" : "max-w-4xl"}`}
        >
          <Kinetic
            chunks={chunks}
            mask
            maskImage={image}
            className={`hero-mask font-semibold tracking-[-0.035em] ${headlineSize} ${
              tall ? "leading-[0.98]" : "leading-[1.02]"
            }`}
          />
        </div>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
          className={`mx-auto mt-7 text-center text-[19px] leading-relaxed text-gray-2 ${
            tall ? "max-w-xl" : "max-w-lg"
          }`}
        >
          {sub}
        </motion.p>

        {cta && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-9 flex justify-center"
          >
            <Link
              href={cta.href}
              className="inline-block rounded-full bg-blue px-7 py-3 text-[17px] font-medium text-white shadow-[0_8px_24px_rgba(0,113,227,0.28)] transition-all duration-300 hover:bg-blue-hi hover:scale-[1.03]"
            >
              {cta.label}
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
