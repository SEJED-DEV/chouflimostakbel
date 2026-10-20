"use client";

import Icon from "@/components/Icons";
import Link from "next/link";

import Reveal, { Rule } from "@/components/Reveal";
import RoleIcons from "@/components/RoleIcons";
import { useSlice } from "@/components/i18n/slice";
import { blogs } from "@/components/i18n/blogs";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";
import type { Post } from "@/lib/posts";

/**
 * One post.
 *
 * The body is already HTML by the time it gets here: the page above rendered
 * the markdown on the server, so reading a post costs the browser no
 * JavaScript for the text at all.
 *
 * The body is trusted, and that is a considered word. A post is somebody
 * else's text, so it was rendered with `micromark` with raw HTML switched
 * off, which escapes anything that looked like a tag rather than running it.
 * Passing it through `dangerouslySetInnerHTML` is therefore passing through
 * text that has already had its teeth removed - the danger was dealt with
 * where it was parsed, not here.
 */
export default function PostContent({ post }: { post: Post }) {
  const t = useSlice(blogs);
  const { profile } = useAuth();
  const { lang } = useLanguage();

  const mine = profile?.id === post.authorId;
  const date = post.publishedAt
    ? new Intl.DateTimeFormat(lang, { dateStyle: "long" }).format(
        new Date(post.publishedAt),
      )
    : null;
  const edited =
    post.status === "published" &&
    new Date(post.updatedAt).getTime() - new Date(post.createdAt).getTime() >
      60_000
      ? new Intl.DateTimeFormat(lang, { dateStyle: "long" }).format(
          new Date(post.updatedAt),
        )
      : null;

  return (
    <>
      <article className="bg-bg pt-36 pb-24 sm:pt-44 sm:pb-32">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <Reveal>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-[14px] font-medium text-gray-2 transition-colors duration-300 hover:text-ink"
            >
              <Icon name="arrow-right" size={14} className="rotate-180" />
              {t.backToBlogs}
            </Link>

            {mine && post.status === "draft" && (
              <div className="mt-6 rounded-2xl border border-sep bg-bg-alt px-5 py-4">
                <p className="text-[15px] leading-relaxed text-gray-2">
                  {t.ownDraft}
                </p>
              </div>
            )}

            <h1 className="mt-6 text-[clamp(1.9rem,4.6vw,3rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-ink">
              {post.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
              <div className="flex items-center gap-2.5">
                <Link
                  href={`/u/${post.author.handle}`}
                  className="shrink-0"
                  aria-hidden="true"
                  tabIndex={-1}
                >
                  {post.author.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.author.avatar}
                      alt=""
                      className="h-9 w-9 rounded-full object-cover"
                      width={36}
                      height={36}
                    />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-alt">
                      <Icon name="user" size={15} className="text-gray" />
                    </span>
                  )}
                </Link>
                <span className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[15px] text-gray-2">
                  <Link
                    href={`/u/${post.author.handle}`}
                    className="font-medium text-ink underline-offset-2 transition-colors duration-200 hover:text-blue hover:underline"
                  >
                    {post.author.name}
                  </Link>
                  <RoleIcons roles={post.author.roles} size={14} />
                  <span className="text-gray">@{post.author.handle}</span>
                </span>
              </div>

              {date && (
                <span className="text-[14px] text-gray">
                  {t.publishedOn} {date}
                </span>
              )}
              <span className="text-[14px] text-gray">
                {t.minRead.replace("{n}", String(post.readingMinutes))}
              </span>
              {edited && (
                <span className="text-[14px] text-gray">
                  {t.editedOn} {edited}
                </span>
              )}
            </div>

            {mine && (
              <div className="mt-6">
                <Link
                  href={`/blogs/${post.slug}/edit`}
                  className="inline-flex items-center gap-2 rounded-full bg-bg-alt px-4 py-2 text-[14px] font-medium text-ink transition-colors duration-300 hover:bg-sep/60"
                >
                  <Icon name="square-pen" size={15} />
                  {t.editPost}
                </Link>
              </div>
            )}
          </Reveal>

          <Rule className="mt-10" />

          {/* The markdown, already rendered and already escaped. */}
          <div
            className="prose-post mt-10"
            dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
          />

          {post.tags.length > 0 && (
            <>
              <Rule className="mt-12" />
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-bg-alt px-3 py-1.5 text-[14px] text-gray-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </article>
    </>
  );
}
