"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Route-level error boundary. Catches runtime failures inside a page and
 * offers a calm recovery instead of a blank screen.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfacing the digest makes production errors traceable.
    console.error(error);
  }, [error]);

  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden bg-bg pt-32 pb-20">
      <div className="mx-auto w-full max-w-xl px-6 text-center sm:px-8">
        <div className="card-soft mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-alt text-[24px]">
          !
        </div>

        <h1 className="mt-7 text-[clamp(1.6rem,4.5vw,2.4rem)] font-semibold tracking-[-0.03em] text-ink">
          Something went sideways.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-[17px] leading-relaxed text-gray-2">
          This page hit an unexpected error. Trying again usually clears it.
        </p>

        {error.digest && (
          <p className="mt-3 font-mono text-[12px] text-gray">ref: {error.digest}</p>
        )}

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-blue px-7 py-3 text-[17px] font-medium text-white shadow-[0_8px_24px_rgba(0,113,227,0.28)] transition-all duration-300 hover:bg-blue-hi hover:scale-[1.03]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full bg-bg-alt px-7 py-3 text-[17px] font-medium text-ink transition-colors duration-300 hover:bg-sep/60"
          >
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}
