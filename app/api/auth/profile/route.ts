import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { currentProfile } from "@/lib/auth";

/**
 * Update the signed-in reader's own profile.
 *
 * The update goes through the row level security policy, so it can only ever
 * touch the caller's own row - not because the application checks, but
 * because the database will not let it touch anyone else's. There is no id
 * in the request and nowhere to put one.
 *
 * Three fields are deliberately absent:
 *
 * - The handle. It is the identity: it appears in URLs and it is what people
 *   type to sign in, so changing it is a separate, deliberate thing - not a
 *   field on a form.
 * - Roles. Granted by the platform, and refused by a trigger on the row
 *   itself, so it cannot be granted from here even by accident.
 * - Verified address. Confirmed by the platform, never by a form.
 */

export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * The caps match the check constraints in the migration exactly. The browser
 * resizes and compresses before it uploads, so these should never be close;
 * they are here so a broken or hostile client gets a 400 instead of a
 * database error it has to be told about.
 */
const AVATAR_LIMIT = 262144;
const BANNER_LIMIT = 1048576;

/** A data URL for one of the formats the browser's canvas can produce. */
const IMAGE_DATA_URL = /^data:image\/(webp|png|jpeg|avif);base64,[A-Za-z0-9+/]+={0,2}$/;

function problem(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

/** null clears it, and anything that is not an image is refused. */
function isImage(value: string, limit: number): boolean {
  return value.length <= limit && IMAGE_DATA_URL.test(value);
}

export async function PATCH(request: Request) {
  const profile = await currentProfile();
  if (!profile) return problem("notSignedIn", 401);

  let body: {
    displayName?: unknown;
    email?: unknown;
    avatarUrl?: unknown;
    bannerUrl?: unknown;
    dateOfBirth?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return problem("invalid", 400);
  }

  const displayName =
    typeof body.displayName === "string"
      ? body.displayName.trim()
      : profile.display_name;

  if (displayName.length < 1 || displayName.length > 80) {
    return problem("invalidName", 400);
  }

  // An address is optional, and clearing it is allowed: the platform works
  // without one. An empty string means "none", not "unchanged".
  const emailRaw =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : null;
  const email = emailRaw === null || emailRaw === "" ? null : emailRaw;

  if (email !== null && !EMAIL.test(email)) return problem("invalidEmail", 400);

  // A field that is absent is left alone; a field that is null is cleared.
  // Keeping those two apart is what lets the form save a display name
  // without quietly wiping the photo.
  const avatarUrl =
    body.avatarUrl === undefined
      ? profile.avatar_url
      : body.avatarUrl === null || body.avatarUrl === ""
        ? null
        : typeof body.avatarUrl === "string" && isImage(body.avatarUrl, AVATAR_LIMIT)
          ? body.avatarUrl
          : undefined;

  if (avatarUrl === undefined) return problem("invalidPhoto", 400);

  const bannerUrl =
    body.bannerUrl === undefined
      ? profile.banner_url
      : body.bannerUrl === null || body.bannerUrl === ""
        ? null
        : typeof body.bannerUrl === "string" && isImage(body.bannerUrl, BANNER_LIMIT)
          ? body.bannerUrl
          : undefined;

  if (bannerUrl === undefined) return problem("invalidPhoto", 400);

  let dateOfBirth: string | null = profile.date_of_birth;
  if (body.dateOfBirth !== undefined) {
    const raw = body.dateOfBirth;
    if (raw === null || raw === "") {
      dateOfBirth = null;
    } else if (typeof raw !== "string" || !ISO_DATE.test(raw)) {
      return problem("invalidDate", 400);
    } else {
      // Round-tripped rather than merely parsed: `new Date("2026-02-30")`
      // does not fail, it quietly becomes the 2nd of March.
      const parsed = new Date(`${raw}T00:00:00Z`);
      const now = new Date();
      if (
        Number.isNaN(parsed.getTime()) ||
        parsed.toISOString().slice(0, 10) !== raw ||
        parsed > now ||
        parsed.getFullYear() < 1900
      ) {
        return problem("invalidDate", 400);
      }
      dateOfBirth = raw;
    }
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        email,
        avatar_url: avatarUrl,
        banner_url: bannerUrl,
        date_of_birth: dateOfBirth,
      })
      .eq("id", profile.id)
      .select("display_name, email, avatar_url, banner_url, date_of_birth")
      .maybeSingle();

    // Zero rows means the policy refused. The reader is signed in but the
    // row is not theirs to write, which should not be reachable.
    if (error || !data) {
      if (error?.code === "23505") return problem("emailTaken", 409);
      return problem("notFound", 404);
    }

    return NextResponse.json({
      ok: true,
      displayName: data.display_name,
      email: data.email,
      avatarUrl: data.avatar_url,
      bannerUrl: data.banner_url,
      dateOfBirth: data.date_of_birth,
    });
  } catch (error) {
    console.error("profile update failed", error);
    return problem("server", 500);
  }
}
