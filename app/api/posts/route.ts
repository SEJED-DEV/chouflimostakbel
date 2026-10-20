import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { currentProfile } from "@/lib/auth";
import {
  existingSlugs,
  parsePostInput,
  readingMinutes,
  slugify,
  uniqueSlug,
} from "@/lib/posts";

/**
 * Write a post.
 *
 * The author is never taken from the request. It comes from the session, so
 * there is no field to spoof in the first place, and the byline is written by
 * a trigger in the database from whatever account that session belongs to -
 * a second line of defence that does not care what this route forgot.
 *
 * Row level security decides the rest: the insert policy says `author_id` must
 * be the caller, and the trigger supplies the handle, name and photo.
 */

export const dynamic = "force-dynamic";

function problem(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(request: Request) {
  const profile = await currentProfile();
  if (!profile) return problem("notSignedIn", 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return problem("invalid", 400);
  }

  const parsed = parsePostInput(body);
  if (!parsed.ok) return problem(parsed.problem, 400);

  const { title, slug, excerpt, bodyMd, tags, status } = parsed.value;

  try {
    const supabase = await createClient();

    // Only published posts need a date, and it is set once - re-saving an
    // edited post never moves it, because the date is what readers see.
    const publishedAt = status === "published" ? new Date().toISOString() : null;

    // A slug the reader left empty becomes the title, hyphenated. Two posts
    // cannot share one, so a free suffix is found before asking.
    const wanted = slug || slugify(title);
    const taken = await existingSlugs();
    const finalSlug = uniqueSlug(wanted, taken);

    const { data, error } = await supabase
      .from("posts")
      .insert({
        author_id: profile.id,
        slug: finalSlug,
        title,
        excerpt,
        body_md: bodyMd,
        tags,
        status,
        published_at: publishedAt,
        reading_minutes: readingMinutes(bodyMd),
      })
      .select("id, slug, status, published_at")
      .maybeSingle();

    if (error || !data) {
      // 23505 is the unique constraint: the slug was taken between the
      // lookup above and the insert. 23514 is a check constraint, which
      // means a limit this route thought it had enforced and did not. Any
      // other failure returning nothing is the policy refusing the row.
      if (error?.code === "23505") return problem("slugTaken", 409);
      if (error?.code === "23514") return problem("invalid", 400);
      return problem("refused", 403);
    }

    return NextResponse.json({
      ok: true,
      id: data.id,
      slug: data.slug,
      status: data.status,
      publishedAt: data.published_at,
    });
  } catch (error) {
    console.error("post create failed", error);
    return problem("server", 500);
  }
}
