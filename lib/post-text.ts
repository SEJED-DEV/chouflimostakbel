import { micromark } from "micromark";

/**
 * The parts of writing a post that are just text: slugs, tags, reading time,
 * markdown.
 *
 * These live apart from `lib/posts.ts` for one reason - that file reads the
 * session cookie, which makes it server-only, and the editor runs in the
 * browser. A module that imports `next/headers` cannot be bundled into a
 * client component, so anything the editor needs has to be reachable without
 * going through it. The markdown preview and the word count are both shown
 * while you type, and both would otherwise cost a round trip to see.
 *
 * No database, no network, no environment: everything here is a pure
 * function of the string you hand it.
 */

/** Reading speed used everywhere on this site. A little above average. */
const WORDS_PER_MINUTE = 220;

/**
 * Roughly how long this takes to read.
 *
 * Tags are stripped because a body of `# Heading` is one word and reads as
 * nothing, and code fences are counted as prose because the alternative is
 * parsing the markdown twice.
 */
export function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/**
 * A URL-safe slug.
 *
 * Folded and stripped rather than transliterated: an Arabic or accented
 * French title leaves nothing behind, and a slug that silently becomes
 * `post-8f3k2` is better than one full of characters the URL will
 * percent-encode anyway. `\p{M}` removes the combining marks the fold
 * leaves, so `Café` is `cafe` and not `caf-`.
 */
export function slugify(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

/**
 * A slug that is free, given a base and the slugs already taken.
 *
 * The database's unique constraint is the real answer to a collision - this
 * only saves the reader a failed save by picking the next suffix itself.
 */
export function uniqueSlug(base: string, taken: readonly string[]): string {
  const seed = base || "post";
  if (!taken.includes(seed)) return seed;

  for (let n = 2; n < 1000; n++) {
    const next = `${seed.slice(0, 80 - String(n).length - 1)}-${n}`;
    if (!taken.includes(next)) return next;
  }

  return `${seed.slice(0, 70)}-${Date.now().toString(36)}`;
}

/**
 * Render markdown to HTML.
 *
 * `micromark` is used rather than a hand-rolled parser for one reason above
 * all: it escapes raw HTML and refuses dangerous link protocols unless it is
 * explicitly told otherwise, and it is never told otherwise here. A post is
 * somebody else's text, so rendering it as HTML is a security decision
 * before it is a formatting one.
 *
 * The result is trusted wherever it is shown - the post page and the editor's
 * preview both pass it through `dangerouslySetInnerHTML` - and that is safe
 * precisely because of the two flags below. Both default to false, and
 * neither is ever turned on. Passed rather than omitted because this is a
 * security decision and a reader should be able to see it was made, not
 * infer it from a missing flag.
 */
export function renderMarkdown(source: string): string {
  return micromark(source, {
    allowDangerousHtml: false,
    allowDangerousProtocol: false,
  });
}

/* ------------------------------------------------------------------ *
 * Writing
 * ------------------------------------------------------------------ */

/** What a request may ask to write. Nothing here identifies the author. */
export interface PostInput {
  title: string;
  slug: string;
  excerpt: string;
  bodyMd: string;
  tags: string[];
  status: "draft" | "published";
}

export type PostInputProblem =
  | "invalidTitle"
  | "invalidSlug"
  | "invalidExcerpt"
  | "invalidBody"
  | "invalidTags"
  | "invalidStatus";

/**
 * Tags, tidied.
 *
 * Letters and numbers of any script are kept, so an Arabic tag survives,
 * and everything else becomes a hyphen. Duplicates go, empties go, and the
 * list is capped - the database refuses more than eight anyway.
 */
export function normaliseTags(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;

  const out: string[] = [];
  for (const raw of value) {
    if (typeof raw !== "string") return null;
    const tag = raw
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 24)
      .replace(/-+$/g, "");

    if (tag && !out.includes(tag)) out.push(tag);
    if (out.length > 8) return null;
  }

  return out;
}

/**
 * Validate a write. Returns the cleaned values or the reason it was refused.
 *
 * Every limit here has a matching constraint in the migration, so a request
 * that gets this far cannot still fail on a check the database enforces - the
 * two are written to agree. The author is absent by design: it comes from the
 * session, and the trigger takes the byline from the account regardless.
 */
export function parsePostInput(
  raw: unknown,
): { ok: true; value: PostInput } | { ok: false; problem: PostInputProblem } {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, problem: "invalidTitle" };
  }
  const body = raw as Record<string, unknown>;

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (title.length < 1 || title.length > 160) {
    return { ok: false, problem: "invalidTitle" };
  }

  const excerpt =
    typeof body.excerpt === "string" ? body.excerpt.trim() : "";
  if (excerpt.length > 400) return { ok: false, problem: "invalidExcerpt" };

  const bodyMd = typeof body.bodyMd === "string" ? body.bodyMd : "";
  if (bodyMd.length > 200000) return { ok: false, problem: "invalidBody" };

  const status =
    body.status === "published"
      ? "published"
      : body.status === "draft"
        ? "draft"
        : null;
  if (status === null) return { ok: false, problem: "invalidStatus" };

  const tags = normaliseTags(body.tags ?? []);
  if (tags === null) return { ok: false, problem: "invalidTags" };

  // An empty slug means "choose one from the title", which is what a reader
  // typing a title and pressing save expects to happen.
  const slug =
    typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  if (slug && !/^[a-z0-9][a-z0-9-]{0,79}$/.test(slug)) {
    return { ok: false, problem: "invalidSlug" };
  }

  return { ok: true, value: { title, slug, excerpt, bodyMd, tags, status } };
}
