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
 * Change or remove one of the caller's own posts.
 *
 * Ownership is not checked here. The update and delete policies both say
 * `author_id = auth.uid()`, so a post belonging to somebody else matches no
 * rows at all and the request changes nothing - which is a stronger answer
 * than this route deciding, because a route can be forgotten.
 *
 * `published_at` is the one field with a rule of its own: it is set the
 * first time a post is published and never moved after. It is the date
 * readers see, so editing a post must not make it look freshly posted.
 */

export const dynamic = "force-dynamic";

function problem(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const profile = await currentProfile();
  if (!profile) return problem("notSignedIn", 401);

  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return problem("invalid", 400);

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

    // What the post is now, so the date rule can be applied. Returns no rows
    // if it is not the caller's, which is the same as it not existing.
    const { data: current } = await supabase
      .from("posts")
      .select("id, slug, status, published_at, author_id")
      .eq("id", id)
      .maybeSingle();

    if (!current || current.author_id !== profile.id) {
      return problem("notFound", 404);
    }

    // Published once, dated once. Re-saving keeps the original date; only a
    // post that has never been published acquires one now.
    const publishedAt =
      status === "published"
        ? (current.published_at ?? new Date().toISOString())
        : null;

    const patch: Record<string, unknown> = {
      title,
      excerpt,
      body_md: bodyMd,
      tags,
      status,
      published_at: publishedAt,
      reading_minutes: readingMinutes(bodyMd),
    };

    // Changing the URL of a post is allowed, but only to one nobody has.
    const wanted = slug || slugify(title);
    if (wanted !== current.slug) {
      const taken = await existingSlugs();
      patch.slug = uniqueSlug(wanted, taken);
    }

    const { data, error } = await supabase
      .from("posts")
      .update(patch)
      .eq("id", id)
      .select("id, slug, status, published_at")
      .maybeSingle();

    if (error || !data) {
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
    console.error("post update failed", error);
    return problem("server", 500);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const profile = await currentProfile();
  if (!profile) return problem("notSignedIn", 401);

  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return problem("invalid", 400);

  try {
    const supabase = await createClient();

    // The delete policy says `author_id = auth.uid()`, so somebody else's
    // post matches no rows and nothing happens. Zero rows is therefore a
    // refusal, not a success.
    const { data, error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) return problem("refused", 403);
    if (!data || data.length === 0) return problem("notFound", 404);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("post delete failed", error);
    return problem("server", 500);
  }
}
