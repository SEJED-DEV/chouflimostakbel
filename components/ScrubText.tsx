"use client";

import { Fragment, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * Scroll-scrubbed reading: words brighten from dim to full as the
 * reader scrolls them through the viewport. Storytelling motion.
 */
export default function ScrubText({
  text,
  className = "",
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  as?: "p" | "h2";
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.5"],
  });

  const words = text.split(" ");

  if (reduce) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      {words.map((w, i) => (
        <ScrubWord
          key={i}
          progress={scrollYProgress}
          start={i / words.length}
          end={(i + 2.5) / words.length}
        >
          {w}
        </ScrubWord>
      ))}
    </Tag>
  );
}

function ScrubWord({
  children,
  progress,
  start,
  end,
}: {
  children: React.ReactNode;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [Math.min(start, 0.95), Math.min(end, 1)], [0.14, 1]);
  return (
    <Fragment>
      <motion.span aria-hidden className="inline-block" style={{ opacity }}>
        {children}
      </motion.span>{" "}
    </Fragment>
  );
}
