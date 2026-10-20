"use client";

import Link from "next/link";
import { Newspaper } from "@phosphor-icons/react/dist/ssr/Newspaper";
import Reveal, { Rule } from "@/components/Reveal";
import { useSlice } from "@/components/i18n/slice";
import { blogs } from "@/components/i18n/blogs";
import { useAuth } from "@/components/AuthProvider";

/**
 * The blogs.
 *
 * It is empty, and it says so. The section exists because it is part of the
 * plan, and an honest empty state is better than a page of placeholders.
 */
export default function BlogsContent() {
  const t = useSlice(blogs);
  const { profile } = useAuth();

  return (
    <>
      <section className="bg-bg pt-36 pb-8 sm:pt-44">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <Reveal>
            <p className="text-[13px] font-semibold text-blue">Choufli Mosta9bel</p>
            <h1 className="mt-3 text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
              {t.title} <span className="text-gray">{t.titleAccent}</span>
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-gray-2">
              {t.sub}
            </p>
          </Reveal>
          <Rule className="mt-10" />
        </div>
      </section>

      <section className="bg-bg pb-24 sm:pb-32">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <div className="card-soft rounded-3xl bg-bg p-8 text-center sm:p-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-alt">
              <Newspaper size={22} weight="regular" className="text-blue" />
            </div>
            <h2 className="mt-5 text-[20px] font-semibold tracking-[-0.02em] text-ink">
              {t.empty}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-[16px] leading-relaxed text-gray-2">
              {t.emptyBody}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {profile ? (
                <Link
                  href="/profile"
                  className="rounded-full bg-blue px-5 py-2.5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-blue-hi"
                >
                  {t.writeOne}
                </Link>
              ) : (
                <Link
                  href="/signup"
                  className="rounded-full bg-blue px-5 py-2.5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-blue-hi"
                >
                  {t.writeOne}
                </Link>
              )}
              <Link
                href="/soon"
                className="rounded-full bg-bg-alt px-5 py-2.5 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-sep/60"
              >
                {t.soonNote}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
