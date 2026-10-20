"use client";

import Icon from "@/components/Icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Reveal, { Rule } from "@/components/Reveal";
import RoleIcons from "@/components/RoleIcons";
import { useSlice } from "@/components/i18n/slice";
import { blogs, type BlogsCopy } from "@/components/i18n/blogs";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { isOlderThan, relativeLabel, relativeTime } from "@/lib/time";
import type { PublicProfile } from "@/lib/people";
import type { PostSummary } from "@/lib/posts";

/**
 * The blogs index.
 *
 * The posts arrive as a prop rather than being fetched here, because the page
 * above this is a server component that already had to read the session to
 * know which drafts this reader may see. Fetching again in the browser would
 * be the same query, over the wire, for nothing.
 *
 * A draft appears here only to the person who wrote it, with a label saying
 * so - the database is what decides that, and no amount of asking for someone
 * else's draft changes the answer.
 */

/**
 * The byline: who wrote it, what they are, and where to find them.
 *
 * The handle links to the person's public page. It sits outside the card's
 * own link rather than inside it, because a link within a link is invalid
 * HTML and a reader aiming at the name would get the post instead. The
 * badges are drawn as icons alone - see `RoleIcons` for why - and carry
 * their names as tooltips.
 */
function Byline({ post }: { post: PostSummary }) {
  return (
    <div className="flex items-center gap-2.5">
      <Link
        href={`/u/${post.author.handle}`}
        className="shrink-0"
        // The photo is decorative next to the name, which is the real link
        // text, so it is not announced twice.
        aria-hidden="true"
        tabIndex={-1}
      >
        {post.author.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.author.avatar}
            alt=""
            className="h-7 w-7 rounded-full object-cover"
            width={28}
            height={28}
          />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-bg-alt">
            <Icon name="user" size={13} className="text-gray" />
          </span>
        )}
      </Link>

      <span className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[14px] text-gray-2">
        <Link
          href={`/u/${post.author.handle}`}
          className="truncate font-medium text-ink underline-offset-2 transition-colors duration-200 hover:text-blue hover:underline"
        >
          {post.author.name}
        </Link>
        <RoleIcons roles={post.author.roles} />
        <span className="text-gray">@{post.author.handle}</span>
      </span>
    </div>
  );
}

/**
 * When a post landed, as "14 min ago" when that is easier to read than a date.
 *
 * `now` is handed in rather than read here. A component that asks the clock
 * while rendering gives the server one answer and the browser another, and
 * React calls that a mismatch - but reading it only in an effect would keep
 * the relative form out of the HTML, where search engines and readers without
 * JavaScript would never see it. Taking it from the server page gives one
 * value to both renders, and the server is where the page is built anyway.
 */
function postedStamp(
  publishedAt: string | null,
  now: string,
  lang: string,
  t: BlogsCopy,
): string | null {
  if (!publishedAt) return null;

  const absolute = new Intl.DateTimeFormat(lang, { dateStyle: "long" }).format(
    new Date(publishedAt),
  );

  // Past a week the count stops helping and the date reads better.
  if (isOlderThan(publishedAt, now)) return absolute;

  return t.postedAgo.replace(
    "{when}",
    relativeLabel(t, relativeTime(publishedAt, now)),
  );
}

/**
 * A person, as the community list shows them.
 *
 * Deliberately small - a photo, a name, a handle, their badges and how much
 * they have written. It answers "is this who I was looking for" and then gets
 * out of the way; the full page is one tap on.
 */
function PersonCard({
  person,
  postCount,
}: {
  person: PublicProfile;
  /** "{n} posts", already translated. */
  postCount: string;
}) {
  return (
    <Link
      href={`/u/${person.handle}`}
      className="group flex items-center gap-3.5 rounded-2xl border border-sep bg-bg p-4 transition-colors duration-300 hover:border-blue/40"
    >
      {person.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={person.avatar}
          alt=""
          className="h-11 w-11 shrink-0 rounded-full object-cover"
          width={44}
          height={44}
        />
      ) : (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bg-alt">
          <Icon name="user" size={17} className="text-gray" />
        </span>
      )}

      <span className="min-w-0 flex-1">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-[15.5px] font-medium text-ink transition-colors duration-300 group-hover:text-blue">
            {person.name}
          </span>
          <RoleIcons roles={person.roles} />
        </span>
        <span className="mt-0.5 flex items-center gap-x-2 text-[13px] text-gray">
          <span className="truncate">@{person.handle}</span>
          <span aria-hidden>&middot;</span>
          <span className="shrink-0">
            {postCount.replace("{n}", String(person.postCount))}
          </span>
        </span>
      </span>
    </Link>
  );
}

function PostCard({ post, now }: { post: PostSummary; now: string }) {
  const t = useSlice(blogs);
  const { lang } = useLanguage();

  const stamp = postedStamp(post.publishedAt, now, lang, t);

  return (
    <Reveal>
      <article className="card-soft rounded-3xl border border-sep bg-bg p-6 transition-colors duration-300 hover:border-blue/40 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          {post.status === "draft" && (
            <span className="rounded-full bg-bg-alt px-2.5 py-0.5 text-[12px] font-medium text-gray-2">
              {t.draft}
            </span>
          )}
          {stamp && <span className="text-[13px] text-gray">{stamp}</span>}
          <span className="text-[13px] text-gray">
            {t.minRead.replace("{n}", String(post.readingMinutes))}
          </span>
        </div>

        <h2 className="mt-3 text-[21px] font-semibold leading-tight tracking-[-0.02em] text-ink">
          {/* The heading carries the link, so the card is reachable by its
              title and the byline below is free to link somewhere else. */}
          <Link
            href={`/community/${post.slug}`}
            className="transition-colors duration-300 hover:text-blue"
          >
            {post.title}
          </Link>
        </h2>

        {post.excerpt && (
          <p className="mt-2 text-[16px] leading-relaxed text-gray-2">
            {post.excerpt}
          </p>
        )}

        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-bg-alt px-2.5 py-1 text-[13px] text-gray-2"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5">
          <Byline post={post} />
        </div>
      </article>
    </Reveal>
  );
}

/**
 * The blogs.
 *
 * Empty when nothing has been written, and it says so rather than showing a
 * page of placeholders - an honest empty state is the better of the two.
 */
/**
 * The blogs.
 *
 * Empty when nothing has been written, and it says so rather than showing a
 * page of placeholders - an honest empty state is the better of the two.
 *
 * `now` comes from the server page that renders this, so the relative stamps
 * are part of the HTML rather than something the browser adds afterwards.
 */
export default function BlogsContent({
  posts,
  people,
  now,
}: {
  posts: PostSummary[];
  /** Everyone with a public page, so a search can find a writer. */
  people: PublicProfile[];
  /** The server's clock, so "14 min ago" is in the HTML. */
  now: string;
}) {
  const t = useSlice(blogs);
  const { profile } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const drafts = posts.filter((p) => p.status === "draft").length;

  /**
   * What the search box is narrowing to.
   *
   * Case is folded but nothing else is: accents and Arabic letter forms are
   * left alone, because someone typing "école" and someone typing "ecole" are
   * both being reasonable and guessing which one they meant is how a search
   * starts losing results it should have found.
   */
  const trimmed = query.trim().toLowerCase();

  const shownPeople = useMemo(() => {
    if (!trimmed) return [];
    return people.filter(
      (p) =>
        p.name.toLowerCase().includes(trimmed) ||
        p.handle.toLowerCase().includes(trimmed),
    );
  }, [people, trimmed]);

  const shownPosts = useMemo(() => {
    if (!trimmed) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(trimmed) ||
        p.excerpt.toLowerCase().includes(trimmed) ||
        p.tags.some((tag) => tag.toLowerCase().includes(trimmed)) ||
        p.author.name.toLowerCase().includes(trimmed) ||
        p.author.handle.toLowerCase().includes(trimmed),
    );
  }, [posts, trimmed]);

  const searching = trimmed.length > 0;
  const nothingFound = searching && !shownPosts.length && !shownPeople.length;

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

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {profile ? (
              <button
                type="button"
                onClick={() => router.push("/community/new")}
                className="inline-flex items-center gap-2 rounded-full bg-blue px-5 py-2.5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-blue-hi"
              >
                <Icon name="square-pen" size={16} />
                {t.write}
              </button>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full bg-blue px-5 py-2.5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-blue-hi"
              >
                <Icon name="square-pen" size={16} />
                {t.write}
              </Link>
            )}

            {drafts > 0 && (
              <span className="text-[14px] text-gray">{t.draftNote}</span>
            )}
          </div>

          {/* Search. One box for both halves of the page: a person's name and
              a post's title are the two things anyone arrives knowing, and a
              reader looking for "sejed" does not first decide whether that is
              a person or a post. */}
          <div className="relative mt-6">
            <Icon
              name="search"
              size={16}
              className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-gray"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchPlaceholder}
              className="input-ios input-ios-leading"
            />
          </div>

          <Rule className="mt-10" />
        </div>
      </section>

      <section className="bg-bg pb-24 sm:pb-32">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          {nothingFound ? (
            <div className="card-soft rounded-3xl bg-bg p-8 text-center sm:p-10">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-alt">
                <Icon name="search" size={20} className="text-gray" />
              </div>
              <h2 className="mt-5 text-[20px] font-semibold tracking-[-0.02em] text-ink">
                {t.noMatches}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-[16px] leading-relaxed text-gray-2">
                {t.noMatchesBody}
              </p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mt-6 rounded-full bg-bg-alt px-5 py-2.5 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-sep/60"
              >
                {t.clearSearch}
              </button>
            </div>
          ) : posts.length === 0 && !searching ? (
            <div className="card-soft rounded-3xl bg-bg p-8 text-center sm:p-10">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-alt">
                <Icon name="newspaper" size={22} className="text-blue" />
              </div>
              <h2 className="mt-5 text-[20px] font-semibold tracking-[-0.02em] text-ink">
                {t.empty}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-[16px] leading-relaxed text-gray-2">
                {t.emptyBody}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={profile ? "/community/new" : "/signup"}
                  className="rounded-full bg-blue px-5 py-2.5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-blue-hi"
                >
                  {t.writeOne}
                </Link>
                <Link
                  href="/soon"
                  className="rounded-full bg-bg-alt px-5 py-2.5 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-sep/60"
                >
                  {t.soonNote}
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {/* People first, when a search brought them up: a reader who
                  typed a name was most likely looking for the person. */}
              {shownPeople.length > 0 && (
                <div>
                  <h2 className="text-[13px] font-semibold tracking-[0.06em] text-gray uppercase">
                    {t.people}
                  </h2>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {shownPeople.map((person) => (
                      <li key={person.id}>
                        <PersonCard person={person} postCount={t.postCount} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {shownPosts.length > 0 && (
                <div>
                  {searching && (
                    <h2 className="text-[13px] font-semibold tracking-[0.06em] text-gray uppercase">
                      {t.posts}
                    </h2>
                  )}
                  <div
                    className={`flex flex-col gap-4 ${searching ? "mt-4" : ""}`}
                  >
                    {shownPosts.map((post) => (
                      <PostCard key={post.id} post={post} now={now} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
