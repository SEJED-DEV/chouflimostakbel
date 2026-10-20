"use client";

import Icon from "@/components/Icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Reveal, { Rule } from "@/components/Reveal";
import { useSlice } from "@/components/i18n/slice";
import { blogs } from "@/components/i18n/blogs";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";
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

/** The byline, and where a reader can go to read more by the same person. */
function Byline({ post }: { post: PostSummary }) {
  return (
    <div className="flex items-center gap-2.5">
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
      <span className="text-[14px] text-gray-2">
        <span className="font-medium text-ink">{post.author.name}</span>
        <span className="text-gray"> · @{post.author.handle}</span>
      </span>
    </div>
  );
}

function PostCard({ post }: { post: PostSummary }) {
  const t = useSlice(blogs);
  const { lang } = useLanguage();

  // Shown in the reader's own language, and only where there is a date: a
  // draft has never been published, so it has none.
  const date = post.publishedAt
    ? new Intl.DateTimeFormat(lang, { dateStyle: "long" }).format(
        new Date(post.publishedAt),
      )
    : null;

  return (
    <Reveal>
      <Link
        href={`/blogs/${post.slug}`}
        className="group block rounded-3xl border border-sep bg-bg p-6 transition-colors duration-300 hover:border-blue/40 sm:p-7"
      >
        <div className="flex flex-wrap items-center gap-2">
          {post.status === "draft" && (
            <span className="rounded-full bg-bg-alt px-2.5 py-0.5 text-[12px] font-medium text-gray-2">
              {t.draft}
            </span>
          )}
          {date && (
            <span className="text-[13px] text-gray">{date}</span>
          )}
          <span className="text-[13px] text-gray">
            {t.minRead.replace("{n}", String(post.readingMinutes))}
          </span>
        </div>

        <h2 className="mt-3 text-[21px] font-semibold leading-tight tracking-[-0.02em] text-ink transition-colors duration-300 group-hover:text-blue">
          {post.title}
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
      </Link>
    </Reveal>
  );
}

/**
 * The blogs.
 *
 * Empty when nothing has been written, and it says so rather than showing a
 * page of placeholders - an honest empty state is the better of the two.
 */
export default function BlogsContent({ posts }: { posts: PostSummary[] }) {
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
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
