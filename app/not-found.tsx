"use client";

import Link from "next/link";
import { House } from "@phosphor-icons/react/dist/ssr/House";
import { Signpost } from "@phosphor-icons/react/dist/ssr/Signpost";
import { Books } from "@phosphor-icons/react/dist/ssr/Books";
import { GraduationCap } from "@phosphor-icons/react/dist/ssr/GraduationCap";
import { useSlice } from "@/components/i18n/slice";
import { errors } from "@/components/i18n/errors";
import { useT } from "@/components/LanguageProvider";

/**
 * The 404 page.
 *
 * A client component, so it can speak the reader's language. It sits inside
 * the root layout, which means the language provider is above it and the
 * saved language applies straight away.
 */
export default function NotFound() {
  const t = useSlice(errors);
  const { t: dict } = useT();

  const paths = [
    { href: "/", label: dict.nav.home, Icon: House },
    { href: "/dropouts", label: dict.nav.dropouts, Icon: Signpost },
    { href: "/divisions", label: dict.nav.divisions, Icon: Books },
    { href: "/graduates", label: dict.nav.graduates, Icon: GraduationCap },
  ];

  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden bg-bg pt-32 pb-20">
      <div className="mx-auto w-full max-w-2xl px-6 text-center sm:px-8">
        <p className="text-[clamp(5rem,18vw,9rem)] leading-none font-semibold tracking-[-0.05em] text-ink/10">
          404
        </p>

        <h1 className="-mt-4 text-[clamp(1.6rem,4.5vw,2.4rem)] font-semibold tracking-[-0.03em] text-ink sm:-mt-6">
          {t.notFound.title}
        </h1>

        <p className="mx-auto mt-4 max-w-md text-[17px] leading-relaxed text-gray-2">
          {t.notFound.body}
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {paths.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="card-soft card-soft-hover flex items-center gap-3 rounded-2xl bg-bg-alt px-5 py-4 text-left text-[16px] font-medium text-ink"
            >
              <l.Icon size={20} weight="regular" className="text-blue" />
              {l.label}
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-blue px-7 py-3 text-[17px] font-medium text-white shadow-[0_8px_24px_rgba(0,113,227,0.28)] transition-all duration-300 hover:bg-blue-hi hover:scale-[1.03]"
        >
          {t.notFound.backHome}
        </Link>
      </div>
    </section>
  );
}
