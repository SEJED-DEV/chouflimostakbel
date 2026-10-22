"use client";

import { useEffect, useState } from "react";
import Skeleton from "@/components/Skeleton";
import Logo from "@/components/Logo";
import { useSlice } from "@/components/i18n/slice";
import { loading } from "@/components/i18n/loading";

/**
 * What a page shows while it is being fetched.
 *
 * Content that simply appeared once the data arrived made the page jump from
 * empty to full, which reads as broken rather than fast. This holds the
 * space with skeleton blocks in the shape of the page that is coming, so the
 * arrival is a fill-in rather than a shove.
 *
 * The wait is not left empty. The site's mark sits above it and one of the
 * project's own lines sits below, so the moment is recognisably this site's
 * rather than a grey void. The line is chosen once per load.
 *
 * The quote is picked in an effect, not during render: the server and the
 * browser would otherwise pick different lines - `Math.random` is not the
 * same on both - and React would report a hydration mismatch. The first line
 * is rendered until the choice is made, which is a difference nobody can see,
 * because it happens before paint.
 *
 * `variant` shapes the blocks to the page underneath: an article is a narrow
 * column, a person's page or the community is a wider one. Getting this wrong
 * would keep the shift the skeleton exists to remove, so the two shapes here
 * mirror the real shells rather than being decorative.
 *
 * `aria-hidden` on the shapes, and a live region naming what is happening, so
 * a screen reader hears "Loading" once instead of walking the skeletons.
 */
export default function PageLoading({
  variant = "article",
  lines = 3,
}: {
  variant?: "article" | "page";
  lines?: number;
}) {
  const t = useSlice(loading);
  const [quote, setQuote] = useState(t.quotes[0]);

  useEffect(() => {
    setQuote(t.quotes[Math.floor(Math.random() * t.quotes.length)]);
  }, [t.quotes]);

  const narrow = variant === "article";

  return (
    <section className="bg-bg pt-36 pb-24 sm:pt-44 sm:pb-32">
      <div
        className={`mx-auto px-6 sm:px-8 ${narrow ? "max-w-3xl" : "max-w-5xl"}`}
      >
        <span role="status" className="sr-only">
          {t.label}
        </span>

        <div aria-hidden>
          <div className="flex items-center gap-3">
            <Logo className="h-8 opacity-70" />
          </div>

          {/* The heading of the page that is coming. */}
          <Skeleton radius="14px" className="mt-8 h-9 w-4/5" />
          {!narrow && <Skeleton radius="14px" className="mt-3 h-9 w-3/5" />}

          {/* A byline row: a small circle and a name. */}
          <div className="mt-6 flex items-center gap-3">
            <Skeleton radius="9999px" className="h-9 w-9" />
            <Skeleton radius="8px" className="h-4 w-32" />
          </div>

          {/* The body. */}
          <div className="mt-10 space-y-3">
            {Array.from({ length: lines }).map((_, i) => (
              <Skeleton
                key={i}
                radius="10px"
                className={`h-4 ${
                  i === lines - 1 ? "w-2/3" : i % 3 === 2 ? "w-5/6" : "w-full"
                }`}
              />
            ))}
          </div>
        </div>

        <p className="mt-12 max-w-md text-[15px] leading-relaxed text-gray-2 italic">
          {quote}
        </p>
      </div>
    </section>
  );
}
