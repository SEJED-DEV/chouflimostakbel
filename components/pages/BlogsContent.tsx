"use client";

import Icon from "@/components/Icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Reveal, { Rule } from "@/components/Reveal";
import RoleIcons from "@/components/RoleIcons";
import { useSlice } from "@/components/i18n/slice";
import { blogs, type BlogsCopy } from "@/components/i18n/blogs";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { isOlderThan, relativeLabel, relativeTime } from "@/lib/time";
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
            href={`/blogs/${post.slug}`}
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
  now,
}: {
  posts: PostSummary[];
  /** The server's clock, so "14 min ago" is in the HTML. */
  now: string;
}) {
  const t = useSlice(blogs);
  const { profile } = useAuth();
  const router = useRouter();

  const drafts = posts.filter((p) => p.status === "draft").length;

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
                onClick={() => router.push("/blogs/new")}
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

          <Rule className="mt-10" />
        </div>
      </section>

      <section className="bg-bg pb-24 sm:pb-32">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          {posts.length === 0 ? (
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
                  href={profile ? "/blogs/new" : "/signup"}
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
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} now={now} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
