"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check } from "@phosphor-icons/react/dist/ssr/Check";
import { Minus } from "@phosphor-icons/react/dist/ssr/Minus";
import Card from "./SpotlightCard";

type Division = {
  name: string;
  tagline: string;
  pros: string[];
  cons: string[];
  subjects: string[];
};

const secondYear: Division[] = [
  {
    name: "Sciences",
    tagline:
      "If you are interested in pursuing any STEM-related career, this is the division for you, one of the most flexible tracks.",
    pros: [
      "Extra year to decide your career path",
      "Highly competitive, motivating environment",
    ],
    cons: [
      "Requires hard work and logical reasoning",
      "High stress, not suitable for every student",
    ],
    subjects: [
      "Mathematics",
      "Physics & Chemistry",
      "Life & Earth Sciences",
      "Technology",
    ],
  },
  {
    name: "Computer Science",
    tagline:
      "Passionate about coding, digital logic, and building tech? Get an early head start into the digital world.",
    pros: [
      "Practical modern skills: algorithms and databases",
      "Interactive, like solving real-world puzzles",
    ],
    cons: [
      "Requires a strict, meticulous mindset",
      "Debugging during timed exams is very stressful",
    ],
    subjects: ["Algorithms & Programming", "ICT", "Mathematics", "Physics"],
  },
  {
    name: "Economics & Services",
    tagline:
      "Interested in how businesses operate, financial markets, and global events? This is the perfect branch for you.",
    pros: [
      "Immediately applicable to real-world situations",
      "Great balance of math without intense lab sciences",
    ],
    cons: [
      "Requires both math and strong writing skills",
      "Must balance calculations with long analytical essays",
    ],
    subjects: ["Economics", "Management", "Mathematics", "History-Geography"],
  },
  {
    name: "Literature",
    tagline:
      "For creative and critical thinkers who love reading, debating, and mastering languages.",
    pros: [
      "Master multiple languages and develop your voice",
      "Heavy analytical reading, discussion, self-expression",
    ],
    cons: [
      "Grading is highly subjective",
      "Grades depend on how convincingly you argue your points",
    ],
    subjects: ["Philosophy", "Arabic", "French", "English", "History-Geography"],
  },
];

const thirdYear: Division[] = [
  {
    name: "Mathematics",
    tagline:
      "For those with a deep love for logic and abstract reasoning, the golden key to elite universities.",
    pros: [
      "Highest priority for engineering, architecture, medicine",
      "Grade based strictly on objective reasoning",
    ],
    cons: [
      "Incredibly fast-paced and abstract",
      "Zero room for slacking, full dedication required",
    ],
    subjects: ["Advanced Mathematics", "Physics & Chemistry"],
  },
  {
    name: "Experimental Sciences",
    tagline:
      "Fascinated by biology, anatomy, and chemistry? Best foundation if your dream is medical school.",
    pros: [
      "Best path to medicine, pharmacy, dentistry, nursing",
      "Grounded in real-world observations, highly engaging",
    ],
    cons: [
      "Massive amount of memory retention required",
      "Must master huge volumes of scientific terminology",
    ],
    subjects: ["Life & Earth Sciences", "Physics & Chemistry", "Mathematics"],
  },
  {
    name: "Technical Sciences",
    tagline:
      "Prefer engineering labs and understanding how machines operate? This is your branch.",
    pros: [
      "Highly practical, schematics and automated logic",
      "Massive head start for civil or mechanical engineering",
    ],
    cons: [
      "Lab exams require absolute geometric precision",
      "Strong spatial visualization is essential",
    ],
    subjects: [
      "Technology (Mechanical & Electrical)",
      "Mathematics",
      "Physics",
    ],
  },
  {
    name: "Sports",
    tagline:
      "An elite athlete who wants to turn their passion for athleticism into a structured academic career.",
    pros: [
      "Designed to balance training with education",
      "Opens paths to sports science, coaching, physical therapy",
    ],
    cons: [
      "Highly exclusive and physically exhausting",
      "Injury can completely disrupt your academic path",
    ],
    subjects: [
      "Physical Education Specialties",
      "Biological Sciences",
      "Anatomy",
    ],
  },
];

const tabs = [
  { id: "second", label: "2nd Year", intro: "The first choice, made at the end of a common year.", items: secondYear },
  { id: "third", label: "3rd Year", intro: "Sciences branch splits into specialized tracks.", items: thirdYear },
] as const;

export default function DivisionTabs() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const tab = tabs[active];

  return (
    <div>
      {/* iOS segmented control */}
      <div
        role="tablist"
        aria-label="High school year"
        className="seg-track inline-flex"
      >
        {tabs.map((t, i) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className="relative rounded-[7px] px-7 py-2 text-[14px] font-medium transition-colors"
          >
            {i === active && (
              <motion.span
                layoutId="seg-pill"
                className="absolute inset-0 rounded-[7px] bg-bg"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.06)" }}
                transition={
                  reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }
                }
              />
            )}
            <span
              className={`relative ${
                i === active ? "text-ink" : "text-gray-2"
              }`}
            >
              {t.label}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab.id}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-gray-2">
            {tab.intro}
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {tab.items.map((d, i) => (
              <motion.div
                key={d.name}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.05 + i * 0.07,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="h-full"
              >
                <Card className="flex h-full flex-col p-8">
                  <h3 className="text-[24px] font-semibold tracking-[-0.02em] text-ink">
                    {d.name}
                  </h3>
                  <p className="mt-3 text-[16px] leading-relaxed text-gray-2">
                    {d.tagline}
                  </p>

                  <div className="mt-7 grid gap-7 sm:grid-cols-2">
                    <div>
                      <h4 className="text-[13px] font-semibold text-ink">Pros</h4>
                      <ul className="mt-3 space-y-2.5">
                        {d.pros.map((p) => (
                          <li key={p} className="flex items-start gap-2.5">
                            <Check
                              size={15}
                              weight="bold"
                              className="mt-1 shrink-0 text-blue"
                            />
                            <span className="text-[14.5px] leading-snug text-gray-2">
                              {p}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-ink">Cons</h4>
                      <ul className="mt-3 space-y-2.5">
                        {d.cons.map((c) => (
                          <li key={c} className="flex items-start gap-2.5">
                            <Minus
                              size={15}
                              weight="bold"
                              className="mt-1 shrink-0 text-gray"
                            />
                            <span className="text-[14.5px] leading-snug text-gray-2">
                              {c}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-7 border-t border-sep pt-5">
                    <h4 className="text-[13px] font-semibold text-ink">
                      Major subjects
                    </h4>
                    <ul className="mt-3.5 flex flex-wrap gap-2">
                      {d.subjects.map((s) => (
                        <li
                          key={s}
                          className="rounded-full bg-bg-alt px-3 py-1.5 text-[13px] font-medium text-gray-2"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
