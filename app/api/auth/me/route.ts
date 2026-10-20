import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/auth";
import { normaliseRoles } from "@/lib/roles";

/**
 * Who is signed in, if anyone.
 *
 * The session is validated by Supabase Auth rather than read out of the
 * cookie, and the profile row comes back through the row level security
 * policies - the reader's own row, and nothing else. A null profile is a
 * success: it means nobody is signed in.
 *
 * `roles` is passed through `normaliseRoles` on the way out. The database
 * already refuses an unknown role, but this is the boundary and a badge
 * nobody defined should not cross it.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const profile = await currentProfile();

  if (!profile) return NextResponse.json({ ok: true, profile: null });

  return NextResponse.json({
    ok: true,
    profile: {
      id: profile.id,
      handle: profile.handle,
      displayName: profile.display_name,
      email: profile.email,
      verified: Boolean(profile.verified_at),
      avatarUrl: profile.avatar_url,
      bannerUrl: profile.banner_url,
      dateOfBirth: profile.date_of_birth,
      memberSince: profile.created_at,
      roles: normaliseRoles(profile.roles),
    },
  });
}
