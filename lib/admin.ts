import { createAdminClient } from "./supabase/admin";
import { normaliseRoles, type RoleKey } from "./roles";

/**
 * What the admin panel shows.
 *
 * SERVER ONLY, and it reads with the service role - `profiles` grants nothing
 * to `anon` and nothing to a signed-in reader, on purpose. Staff are not
 * given a grant on the table; they are given this panel, which reads it
 * through the service role and hands back the columns listed here. A staff
 * member with a database client still cannot read an address.
 *
 * The panel is read-only for now. The moderation queue that belongs here is
 * not built - the roadmap says so, and saying it again in the product would
 * be a small lie. What is here is the part that is true.
 *
 * Two queries, and the counts are worked out here rather than asked of the
 * database. A `count` over an embedded resource and a comparison against a
 * `text[]` are both things PostgREST spells in ways that are easy to get
 * subtly wrong, and a panel that silently counts nothing is worse than a
 * panel that counts a hundred rows in JavaScript.
 */

/** One person, as the panel shows them. */
export interface AdminPerson {
  id: string;
  handle: string;
  displayName: string;
  roles: RoleKey[];
  createdAt: string;
  postCount: number;
  /** Set when the account was never confirmed - the email is optional here. */
  verified: boolean;
}

/** One post, as the panel shows it. */
export interface AdminPost {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published";
  authorHandle: string;
  authorName: string;
  publishedAt: string | null;
  createdAt: string;
  readingMinutes: number;
}

/** The counts at the top of the panel. */
export interface AdminOverview {
  people: number;
  published: number;
  drafts: number;
  staff: number;
}

/** Everything the panel shows, read in two round trips. */
export interface AdminData {
  overview: AdminOverview;
  people: AdminPerson[];
  posts: AdminPost[];
}

export async function readAdminData(
  peopleLimit = 200,
  postsLimit = 200,
): Promise<AdminData> {
  const empty: AdminData = {
    overview: { people: 0, published: 0, drafts: 0, staff: 0 },
    people: [],
    posts: [],
  };

  try {
    const admin = createAdminClient();

    const [peopleResult, postsResult] = await Promise.all([
      admin
        .from("profiles")
        .select("id, handle, display_name, roles, created_at, verified_at")
        .order("created_at", { ascending: false })
        .limit(peopleLimit),
      admin
        .from("posts")
        .select(
          "id, slug, title, status, author_id, author_handle, author_name, published_at, created_at, reading_minutes",
        )
        .order("created_at", { ascending: false })
        .limit(postsLimit),
    ]);

    if (peopleResult.error || postsResult.error) return empty;

    const rawPeople = (peopleResult.data ?? []) as Record<string, unknown>[];
    const rawPosts = (postsResult.data ?? []) as Record<string, unknown>[];

    // How much each person has written, counted here rather than through an
    // embedded aggregate.
    const counts = new Map<string, number>();
    for (const row of rawPosts) {
      const id = row.author_id as string | undefined;
      if (!id) continue;
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }

    const people: AdminPerson[] = rawPeople.map((row) => {
      const id = row.id as string;
      return {
        id,
        handle: row.handle as string,
        displayName: (row.display_name as string) || (row.handle as string),
        roles: normaliseRoles(row.roles),
        createdAt: row.created_at as string,
        verified: Boolean(row.verified_at),
        postCount: counts.get(id) ?? 0,
      };
    });

    const posts: AdminPost[] = rawPosts.map((row) => ({
      id: row.id as string,
      slug: row.slug as string,
      title: row.title as string,
      status: row.status as "draft" | "published",
      authorHandle: (row.author_handle as string) ?? "",
      authorName:
        (row.author_name as string) || (row.author_handle as string) || "",
      publishedAt: (row.published_at as string) ?? null,
      createdAt: row.created_at as string,
      readingMinutes: (row.reading_minutes as number) ?? 1,
    }));

    return {
      overview: {
        people: people.length,
        published: posts.filter((p) => p.status === "published").length,
        drafts: posts.filter((p) => p.status === "draft").length,
        staff: people.filter((p) => p.roles.length > 0).length,
      },
      people,
      posts,
    };
  } catch {
    // A database that is down should show an empty panel rather than take
    // the page down with it.
    return empty;
  }
}
