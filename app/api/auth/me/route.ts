import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/auth";
import { asProfile } from "@/lib/db";

/** Who is signed in, if anyone. */
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await currentProfile();
  if (!session) return NextResponse.json({ ok: true, profile: null });

  // Read the profile through the row level security policies, with the
  // session's identity set. The database decides what this may see, which
  // is the point of doing it here rather than trusting the session's copy.
  const result = await asProfile(session.profile_id, (client) =>
    client.query(
      "select id, handle, display_name, email, verified_at from profiles where id = $1",
      [session.profile_id],
    ),
  );

  const row = result.rows[0];
  if (!row) return NextResponse.json({ ok: true, profile: null });

  return NextResponse.json({
    ok: true,
    profile: {
      id: row.id,
      handle: row.handle,
      displayName: row.display_name,
      email: row.email,
      verified: Boolean(row.verified_at),
    },
  });
}
