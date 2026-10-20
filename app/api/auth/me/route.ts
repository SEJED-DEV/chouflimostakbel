import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/auth";

/**
 * Who is signed in, if anyone.
 *
 * The session is validated by Supabase Auth rather than read out of the
 * cookie, and the profile row comes back through the row level security
 * policies - the reader's own row, and nothing else. A null profile is a
 * success: it means nobody is signed in.
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
    },
  });
}
