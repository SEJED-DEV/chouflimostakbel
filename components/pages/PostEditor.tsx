"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Icon from "@/components/Icons";
import Reveal, { Rule } from "@/components/Reveal";
import { useSlice } from "@/components/i18n/slice";
import { blogs } from "@/components/i18n/blogs";
import { renderMarkdown, readingMinutes } from "@/lib/post-text";
import type { PostSummary } from "@/lib/posts";

/**
 * Writing a post.
 *
 * There is no autosave. A post is not a note - it is something that appears
 * under your name - so saving is a thing you do on purpose, and the button
 * says which of the two states it is saving.
 *
 * The preview renders the same markdown the reader will see, through the same
 * function, so what is on screen here is what will be on the page. It is a
 * `dangerouslySetInnerHTML` again for the same reason and with the same
 * answer: `micromark` escaped it when it parsed it.
 */

/** Field names, so the labels and the state agree on one spelling. */
type Field = "title" | "slug" | "excerpt" | "bodyMd" | "tags";

const EMPTY = {
  title: "",
  slug: "",
  excerpt: "",
  bodyMd: "",
  tags: "",
  status: "draft" as "draft" | "published",
};

export default function PostEditor({ post }: { post?: PostSummary & { bodyMd?: string } }) {
  const t = useSlice(blogs);
  const router = useRouter();

  const [values, setValues] = useState({
    ...EMPTY,
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    bodyMd: post?.bodyMd ?? "",
    tags: post?.tags.join(", ") ?? "",
    status: post?.status ?? "draft",
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const set = (field: Field, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    setSaved(false);
  };

  const words = useMemo(
    () => values.bodyMd.trim().split(/\s+/).filter(Boolean).length,
    [values.bodyMd],
  );

  /** The preview and the reading time come from the same parser as the page. */
  const preview = useMemo(() => renderMarkdown(values.bodyMd), [values.bodyMd]);

  async function save(nextStatus: "draft" | "published") {
    setBusy(true);
    setError(null);

    try {
      const payload = {
        title: values.title,
        slug: values.slug,
        excerpt: values.excerpt,
        bodyMd: values.bodyMd,
        status: nextStatus,
        tags: values.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      const response = await fetch(
        post ? `/api/posts/${post.id}` : "/api/posts",
        {
          method: post ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.ok) {
        const key = result?.error as keyof typeof t.errors | undefined;
        setError(key && t.errors[key] ? t.errors[key] : t.errors.server);
        setBusy(false);
        return;
      }

      setSaved(true);

      // A published post goes to its page - that is the thing the reader
      // wanted to happen. A draft stays here, because there is nothing to
      // look at and leaving would lose the rest of the evening's work.
      if (nextStatus === "published") {
        router.push(`/blogs/${result.slug}`);
        return;
      }

      // On a first save the post gets an id and a slug; without this the
      // next save would create a second post rather than update this one.
      if (!post) router.replace(`/blogs/${result.slug}/edit`);
      setBusy(false);
    } catch {
      setError(t.errors.network);
      setBusy(false);
    }
  }

  async function remove() {
    if (!post) return;
    setDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        const key = result?.error as keyof typeof t.errors | undefined;
        setError(key && t.errors[key] ? t.errors[key] : t.errors.server);
        setDeleting(false);
        setConfirming(false);
        return;
      }
      router.push("/blogs");
    } catch {
      setError(t.errors.network);
      setDeleting(false);
      setConfirming(false);
    }
  }

  const label = "block text-[14px] font-medium text-ink";
  const field =
    "mt-2 w-full rounded-2xl border border-sep bg-bg px-4 py-3 text-[16px] text-ink placeholder:text-gray focus:border-blue focus:outline-none";
  const hint = "mt-2 text-[13px] leading-relaxed text-gray";

  return (
    <section className="bg-bg pt-36 pb-24 sm:pt-44 sm:pb-32">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-[14px] font-medium text-gray-2 transition-colors duration-300 hover:text-ink"
            >
              <Icon name="arrow-right" size={14} className="rotate-180" />
              {t.backToBlogs}
            </Link>

            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full bg-bg-alt px-4 py-2 text-[14px] font-medium text-ink transition-colors duration-300 hover:bg-sep/60"
            >
              <Icon name="newspaper" size={15} />
              {t.preview}
            </button>
          </div>

          <h1 className="mt-6 text-[clamp(1.8rem,4.4vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-ink">
            {post ? t.editorEdit : t.editorNew}
          </h1>
        </Reveal>

        <Rule className="mt-8" />

        <form
          className="mt-8 flex flex-col gap-7"
          onSubmit={(event) => {
            event.preventDefault();
            void save(values.status);
          }}
        >
          <div>
            <label className={label} htmlFor="post-title">
              {t.fieldTitle}
            </label>
            <input
              id="post-title"
              className={field}
              value={values.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder={t.titlePlaceholder}
              maxLength={160}
              required
            />
          </div>

          <div>
            <label className={label} htmlFor="post-slug">
              {t.fieldSlug}
            </label>
            <input
              id="post-slug"
              className={field}
              value={values.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder={t.slugPlaceholder}
              maxLength={80}
              dir="ltr"
            />
            <p className={hint}>{t.slugHint}</p>
          </div>

          <div>
            <label className={label} htmlFor="post-excerpt">
              {t.fieldExcerpt}
            </label>
            <input
              id="post-excerpt"
              className={field}
              value={values.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder={t.excerptPlaceholder}
              maxLength={400}
            />
            <p className={hint}>{t.excerptHint}</p>
          </div>

          <div>
            <label className={label} htmlFor="post-tags">
              {t.fieldTags}
            </label>
            <input
              id="post-tags"
              className={field}
              value={values.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder={t.tagsPlaceholder}
            />
            <p className={hint}>{t.tagsHint}</p>
          </div>

          <div>
            <label className={label} htmlFor="post-body">
              {t.fieldBody}
            </label>

            {showPreview ? (
              <div
                className="prose-post mt-2 rounded-2xl border border-sep bg-bg-alt p-5"
                dangerouslySetInnerHTML={{ __html: preview }}
              />
            ) : (
              <textarea
                id="post-body"
                className={`${field} min-h-[320px] font-mono text-[15px] leading-relaxed`}
                value={values.bodyMd}
                onChange={(e) => set("bodyMd", e.target.value)}
                placeholder={t.bodyPlaceholder}
              />
            )}

            <p className={hint}>
              {t.bodyHint} · {t.words.replace("{n}", String(words))} ·{" "}
              {t.minRead.replace("{n}", String(readingMinutes(values.bodyMd)))}
            </p>
          </div>

          {error && (
            <p className="rounded-2xl border border-sep bg-bg-alt px-4 py-3 text-[15px] text-ink">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-blue px-6 py-2.5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-blue-hi disabled:opacity-50"
            >
              {busy ? t.saving : t.saveDraft}
            </button>

            {values.status !== "published" && (
              <button
                type="button"
                disabled={busy}
                onClick={() => void save("published")}
                className="rounded-full bg-bg-alt px-6 py-2.5 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-sep/60 disabled:opacity-50"
              >
                {t.publish}
              </button>
            )}

            {saved && (
              <span className="inline-flex items-center gap-1.5 text-[14px] text-gray-2">
                <Icon name="circle-check" size={15} className="text-blue" />
                {t.saved}
              </span>
            )}

            <Link
              href="/blogs"
              className="rounded-full px-5 py-2.5 text-[15px] font-medium text-gray-2 transition-colors duration-300 hover:text-ink"
            >
              {t.cancel}
            </Link>
          </div>

          {post && !confirming && (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="self-start text-[14px] font-medium text-gray-2 underline-offset-4 transition-colors duration-300 hover:text-ink hover:underline"
            >
              {t.deletePost}
            </button>
          )}

          {post && confirming && (
            <div className="rounded-2xl border border-sep bg-bg-alt p-5">
              <p className="text-[15px] text-ink">{t.deleteConfirm}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => void remove()}
                  className="rounded-full bg-blue px-5 py-2 text-[14px] font-medium text-white transition-colors duration-300 hover:bg-blue-hi disabled:opacity-50"
                >
                  {deleting ? t.deleting : t.deletePost}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="rounded-full px-5 py-2 text-[14px] font-medium text-gray-2 transition-colors duration-300 hover:text-ink"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
