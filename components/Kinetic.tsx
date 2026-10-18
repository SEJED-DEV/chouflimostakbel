"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "motion/react";

export type HeroChunk = { t: string; accent?: boolean };

type Token = { text: string; ws: boolean; accent: boolean };

/**
 * Calm sequential headline reveal: words fade and rise gently into place.
 * Accent chunks render in system blue. Whitespace tokens stay outside the
 * animated inline-blocks so spaces are never trimmed.
 */
export default function Kinetic({
  chunks,
  className = "",
  delay = 0.1,
  accentClass = "text-blue",
  mask = false,
  maskImage,
  as: Tag = "h1",
}: {
  chunks: HeroChunk[];
  className?: string;
  delay?: number;
  /** Class applied to accent chunks — override on dark/photo backgrounds. */
  accentClass?: string;
  /** Fill the letterforms with a photo via background-clip:text. */
  mask?: boolean;
  /** Image used as the fill when `mask` is on. */
  maskImage?: string;
  as?: "h1" | "h2";
}) {
  const reduce = useReducedMotion();
  const plain = chunks.map((c) => c.t).join("");
  const maskStyle = mask && maskImage ? { ["--hero-img" as string]: `url(${maskImage})` } : undefined;

  if (reduce) {
    return (
      <Tag className={className} style={maskStyle}>
        {chunks.map((c, i) =>
          c.accent ? (
            <span key={i} className={accentClass}>
              {c.t}
            </span>
          ) : (
            <span key={i}>{c.t}</span>
          )
        )}
      </Tag>
    );
  }

  // Tokenise per chunk (keeping whitespace) so punctuation that straddles a
  // chunk boundary - like "future" + ", no" - stays glued, while real spaces
  // render as text nodes outside the animated inline-blocks.
  const tokens: Token[] = [];
  for (const c of chunks) {
    for (const part of c.t.split(/(\s+)/)) {
      if (!part.length) continue;
      tokens.push({ text: part, ws: /^\s+$/.test(part), accent: !!c.accent });
    }
  }

  let wordIndex = 0;

  return (
    <Tag className={className} aria-label={plain} style={maskStyle}>
      {tokens.map((tok, i) => {
        if (tok.ws) {
          return <Fragment key={i}>{tok.text}</Fragment>;
        }
        const n = wordIndex++;
        return (
          <span key={i} aria-hidden className="inline-block">
            <motion.span
              className={`inline-block ${tok.accent ? accentClass : ""}`}
              initial={{ opacity: 0, y: "0.35em" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: delay + n * 0.05,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              {tok.text}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
