import { createClient } from "./supabase/server";
import { normaliseRoles, type RoleKey } from "./roles";
import type { PostSummary } from "./posts";

/**
 * A person, as the public is allowed to see them.
 *
 * Reads the `public_profiles` view rather than the `profiles` table, and that
 * is the whole point: the table holds an address, a birthday and a
 * verification time, and the view holds none of them. There is deliberately
 * no field here for anything the view does not expose, so a later change to
 * this file cannot leak a column the database was careful to withhold.
 *
 * SERVER ONLY - it goes through the same cookie-aware client as everything
 * else, though nothing here depends on who is asking.
 */
export interface PublicProfile {
  id: string;
  handle: string;
  name: string;
  avatar: string | null;
  banner: string | null;
  roles: RoleKey[];
  joinedAt: string;
  postCount: number;
  lastPublishedAt: string | null;
}

const SELECT =
  "id, handle, display_name, avatar_url, banner_url, roles, created_at, " +
  "post_count, last_published_at";

function toProfile(row: Record<string, unknown>): PublicProfile {
  return {
    id: row.id as string,
    handle: row.handle as string,
    name: (row.display_name as string) || (row.handle as string),
    avatar: (row.avatar_url as string | null) ?? null,
    banner: (row.banner_url as string | null) ?? null,
    roles: normaliseRoles(row.roles),
    joinedAt: row.created_at as string,
    postCount: Number(row.post_count ?? 0),
    lastPublishedAt: (row.last_published_at as string | null) ?? null,
  };
}

/**
 * One person by handle, or nobody.
 *
 * A handle is case-insensitive in the database (`citext`) and in the URL, so
 * the lookup lowercases before asking. Only a person who has published
 * something is in the view at all, which means a handle that appears on a
 * post always resolves and a handle that only exists in a signup does not -
 * and nothing links to the latter anyway.
 */
export async function getPublicProfile(handle: string): Promise<PublicProfile | null> {
  const wanted = handle.trim().toLowerCase();
  if (!wanted) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("public_profiles")
      .select(SELECT)
      .eq("handle", wanted)
      .maybeSingle();

    if (error || !data) return null;
    return toProfile(data as unknown as Record<string, unknown>);
  } catch {
    return null;
  }
}

/**
 * Everything one person has published, newest first.
 *
 * Published only, never the author's own drafts: this list is shown to
 * whoever follows the byline, and a draft is visible to its author alone by
 * policy. The query is written without a session in mind, so it needs no
 * special case when the reader happens to be the author.
 */
export async function listPublishedByAuthor(authorId: string): Promise<PostSummary[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select(
        "id, slug, title, excerpt, tags, status, published_at, created_at, " +
          "updated_at, reading_minutes, author_id, author_handle, author_name, " +
          "author_avatar, author_roles",
      )
      .eq("author_id", authorId)
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error || !data) return [];

    // The select string is long enough that PostgREST's inference gives up
    // and hands back a placeholder, so the rows are read as they arrive.
    const list = Array.isArray(data)
      ? (data as unknown as Record<string, unknown>[])
      : [];
    return list.map((row) => ({
      id: row.id as string,
      slug: row.slug as string,
      title: row.title as string,
      excerpt: row.excerpt as string,
      tags: (row.tags as string[]) ?? [],
      status: "published" as const,
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
    }));
  } catch {
    return [];
  }
}
