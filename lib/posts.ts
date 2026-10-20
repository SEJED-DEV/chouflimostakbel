import { createClient } from "./supabase/server";
import { renderMarkdown } from "./post-text";
import { normaliseRoles, type RoleKey } from "./roles";

// The pure text work - slugs, tags, reading time, markdown - lives in
// `post-text.ts`, which a client component may import. This file reads the
// session cookie and cannot be. Re-exported here so the two are one import
// for anything running on the server.
export * from "./post-text";

/**
 * Posts: the shape of one, and the reads the site does with it.
 *
 * SERVER ONLY - every function here reads the session cookie. Markdown is
 * rendered on the server, so reading a post costs the reader no JavaScript
 * for the text at all.
 */

/** What a post looks like everywhere it is listed. */
export interface PostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  status: "draft" | "published";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  readingMinutes: number;
  /** The account that wrote it. Kept apart from the byline, which is a copy. */
  authorId: string;
  author: {
    handle: string;
    name: string;
    avatar: string | null;
    /** The badges the account held when the post was written. */
    roles: RoleKey[];
  };
}

/** A post plus its body: rendered for reading, source for editing. */
export interface Post extends PostSummary {
  bodyHtml: string;
  /** The markdown as it was written. Only ever reaches the person editing. */
  bodyMd: string;
}

const SELECT =
  "id, slug, title, excerpt, tags, status, published_at, created_at, " +
  "updated_at, reading_minutes, author_id, author_handle, author_name, " +
  "author_avatar, author_roles";

/**
 * Rows, as plain objects.
 *
 * The select string above is long enough that PostgREST's type inference
 * gives up and hands back a placeholder type, so the rows are read as they
 * actually arrive rather than as TypeScript guessed them. `toSummary` does
 * the real checking, field by field.
 */
function rows(data: unknown): Record<string, unknown>[] {
  return Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
}

function toSummary(row: Record<string, unknown>): PostSummary {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    excerpt: row.excerpt as string,
    tags: (row.tags as string[]) ?? [],
    status: row.status as "draft" | "published",
    publishedAt: (row.published_at as string | null) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    readingMinutes: row.reading_minutes as number,
    authorId: row.author_id as string,
    author: {
      handle: row.author_handle as string,
      name: (row.author_name as string) || (row.author_handle as string),
      avatar: (row.author_avatar as string | null) ?? null,
      roles: normaliseRoles(row.author_roles),
    },
  };
}

/**
 * The published feed, newest first.
 *
 * Drafts are excluded here rather than filtered out afterwards, because the
 * policy already refuses them to anyone but their author and a second filter
 * would only be pretending to help.
 */
export async function listPublishedPosts(): Promise<PostSummary[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select(SELECT)
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error || !data) return [];
    return rows(data).map(toSummary);
  } catch {
    return [];
  }
}

/**
 * Every post the caller is allowed to see: all of the published ones, plus
 * their own drafts.
 *
 * This is not a filter applied after the fact. The select policy on `posts`
 * is precisely this statement, so the database does the deciding and this
 * only asks for everything. That is also why there is no "include drafts"
 * argument - a stranger cannot be shown one even if this asked for it.
 */
export async function listVisiblePosts(): Promise<PostSummary[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select(SELECT)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("updated_at", { ascending: false });

    if (error || !data) return [];
    return rows(data).map(toSummary);
  } catch {
    return [];
  }
}

/**
 * A reader's own posts, drafts included, most recently touched first.
 *
 * What the profile's "your posts" list is for, and the only place a draft
 * appears anywhere on the site.
 */
export async function listPostsByAuthor(authorId: string): Promise<PostSummary[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select(SELECT)
      .eq("author_id", authorId)
      .order("updated_at", { ascending: false });

    if (error || !data) return [];
    return rows(data).map(toSummary);
  } catch {
    return [];
  }
}

/**
 * One post by its slug: published, or a draft the caller owns.
 *
 * There is no separate "am I allowed to see this" check - the select policy
 * answers that, and a draft that is not the caller's simply does not come
 * back, which is indistinguishable from it not existing.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select(`${SELECT}, body_md`)
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) return null;

    return {
      ...toSummary(data),
      bodyHtml: renderMarkdown(data.body_md as string),
      bodyMd: data.body_md as string,
    };
  } catch {
    return null;
  }
}

/**
 * Every slug that already exists, for choosing a free one.
 *
 * Only the slugs the caller can see, which is fine: a slug is not secret,
 * and the database refuses the duplicate regardless.
 */
export async function existingSlugs(): Promise<string[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("posts").select("slug");
    if (!data) return [];
    return data.map((row) => row.slug as string);
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ *
 * Writing
 * ------------------------------------------------------------------ */
// The writing helpers - `PostInput`, `normaliseTags`, `parsePostInput` - live
// in `post-text.ts` alongside the markdown and the slugs, and are re-exported
// above. They are pure functions over the request body, and the editor runs
// some of them in the browser to show a live preview, so they cannot sit in a
// file that imports the session cookie.

