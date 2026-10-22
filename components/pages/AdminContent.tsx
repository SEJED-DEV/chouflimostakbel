"use client";

import Link from "next/link";
import Icon from "@/components/Icons";
import Reveal, { Rule } from "@/components/Reveal";
import RoleIcons from "@/components/RoleIcons";
import { useSlice } from "@/components/i18n/slice";
import { admin, type AdminCopy } from "@/components/i18n/admin";
import { useLanguage } from "@/components/LanguageProvider";
import type {
  AdminOverview,
  AdminPerson,
  AdminPost,
} from "@/lib/admin";

/**
 * The admin panel.
 *
 * The data arrives from the server, already read with the service role. This
 * component decides how it is shown and nothing else - it cannot widen what
 * it is given, because it is given only what the page chose to read.
 *
 * The layout is a table on a wide screen and a card on a narrow one. A table
 * that scrolls sideways on a phone is a table nobody reads, and the people
 * who need this page are the ones most likely to be holding a phone.
 */
export default function AdminContent({
  overview,
  people,
  posts,
}: {
  overview: AdminOverview;
  people: AdminPerson[];
  posts: AdminPost[];
}) {
  const t = useSlice(admin);
  const { lang } = useLanguage();

  const date = (value: string | null) =>
    value
      ? new Intl.DateTimeFormat(lang, { dateStyle: "medium" }).format(
          new Date(value),
        )
      : "-";

  return (
    <>
      <section className="bg-bg pt-36 pb-8 sm:pt-44">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <Reveal>
            <p className="text-[13px] font-semibold text-blue">
              {t.eyebrow}
            </p>
            <h1 className="mt-3 text-[clamp(2rem,5vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
              {t.title} <span className="text-blue">{t.titleAccent}</span>
            </h1>
            <p className="mt-4 max-w-2xl text-[16.5px] leading-relaxed text-gray-2">
              {t.sub}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-bg pb-10">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <Reveal delay={0.05}>
            <h2 className="text-[13px] font-semibold tracking-[0.06em] text-gray uppercase">
              {t.overview}
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label={t.people} value={overview.people} />
              <Stat label={t.published} value={overview.published} />
              <Stat label={t.drafts} value={overview.drafts} />
              <Stat label={t.staff} value={overview.staff} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* -------------------- People -------------------- */}
      <section className="bg-bg pb-12">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <Reveal>
            <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">
              {t.peopleTitle}
            </h2>
            <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-gray-2">
              {t.peopleSub}
            </p>
          </Reveal>

          {people.length === 0 ? (
            <p className="mt-6 text-[16px] text-gray-2">{t.noPeople}</p>
          ) : (
            <>
              {/* Wide: a table. */}
              <div className="mt-6 hidden overflow-hidden rounded-2xl border border-sep md:block">
                <table className="w-full border-collapse text-start">
                  <thead>
                    <tr className="border-b border-sep bg-bg-alt text-[12px] tracking-[0.05em] text-gray uppercase">
                      <th className="px-4 py-3 text-start font-semibold">
                        {t.handle}
                      </th>
                      <th className="px-4 py-3 text-start font-semibold">
                        {t.name}
                      </th>
                      <th className="px-4 py-3 text-start font-semibold">
                        {t.badges}
                      </th>
                      <th className="px-4 py-3 text-start font-semibold">
                        {t.posts}
                      </th>
                      <th className="px-4 py-3 text-start font-semibold">
                        {t.joined}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {people.map((person) => (
                      <tr
                        key={person.id}
                        className="border-b border-sep last:border-b-0"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/u/${person.handle}`}
                            className="text-[14.5px] font-medium text-ink transition-colors duration-200 hover:text-blue"
                          >
                            @{person.handle}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-[14.5px] text-gray-2">
                          {person.displayName}
                        </td>
                        <td className="px-4 py-3">
                          <RoleIcons roles={person.roles} size={14} />
                        </td>
                        <td className="px-4 py-3 text-[14.5px] text-gray-2">
                          {person.postCount}
                        </td>
                        <td className="px-4 py-3 text-[14.5px] text-gray-2">
                          {date(person.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Narrow: a card each, because a sideways-scrolling table is a
                  table nobody reads on a phone. */}
              <ul className="mt-6 space-y-3 md:hidden">
                {people.map((person) => (
                  <li
                    key={person.id}
                    className="rounded-2xl border border-sep p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={`/u/${person.handle}`}
                          className="text-[15.5px] font-medium text-ink"
                        >
                          {person.displayName}
                        </Link>
                        <p className="mt-0.5 truncate text-[13.5px] text-gray">
                          @{person.handle}
                        </p>
                      </div>
                      <RoleIcons roles={person.roles} size={14} />
                    </div>
                    <div className="mt-3 flex items-center gap-x-4 gap-y-1 text-[13px] text-gray">
                      <span>
                        {t.posts}: {person.postCount}
                      </span>
                      <span aria-hidden>&middot;</span>
                      <span>
                        {t.joined}: {date(person.createdAt)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      {/* -------------------- Posts -------------------- */}
      <section className="bg-bg pb-12">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <Reveal>
            <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">
              {t.postsTitle}
            </h2>
            <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-gray-2">
              {t.postsSub}
            </p>
          </Reveal>

          {posts.length === 0 ? (
            <p className="mt-6 text-[16px] text-gray-2">{t.noPosts}</p>
          ) : (
            <ul className="mt-6 space-y-3">
              {posts.map((post) => (
                <li
                  key={post.id}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-2xl border border-sep px-4 py-3"
                >
                  <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-ink">
                    {post.title}
                  </span>
                  <span className="text-[13px] text-gray">
                    @{post.authorHandle}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11.5px] font-semibold ${
                      post.status === "published"
                        ? "bg-blue/10 text-blue"
                        : "bg-bg-alt text-gray-2"
                    }`}
                  >
                    {post.status === "published" ? t.published : t.drafts}
                  </span>
                  <span className="text-[13px] text-gray">
                    {date(post.publishedAt ?? post.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* -------------------- What is not here yet -------------------- */}
      <section className="bg-bg pb-24 sm:pb-32">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <Rule className="mb-10" />
          <Reveal>
            <div className="card-soft rounded-3xl bg-bg p-6 sm:p-8">
              <div className="flex items-center gap-2.5">
                <Icon name="circle-info" size={17} className="text-gray" />
                <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-ink">
                  {t.moderationTitle}
                </h2>
              </div>
              <p className="mt-2.5 max-w-2xl text-[15.5px] leading-relaxed text-gray-2">
                {t.moderationBody}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/** One count. */
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card-soft rounded-2xl bg-bg p-4">
      <p className="text-[26px] font-semibold leading-none tracking-[-0.02em] text-ink">
        {value}
      </p>
      <p className="mt-1.5 text-[13px] text-gray">{label}</p>
    </div>
  );
}
