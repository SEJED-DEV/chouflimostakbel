import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/auth";
import { asProfile } from "@/lib/db";

/**
 * Update the signed-in reader's own profile.
 *
 * The update goes through the row level security policy, so it can only ever
 * touch the caller's own row - not because the application checks, but
 * because the database will not let it touch anyone else's.
 */

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const session = await currentProfile();
  if (!session) {
    return NextResponse.json({ ok: false, error: "notSignedIn" }, { status: 401 });
  }

  let body: { displayName?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const displayName = typeof body.displayName === "string" ? body.displayName.trim() : "";
  if (displayName.length < 1 || displayName.length > 80) {
    return NextResponse.json({ ok: false, error: "invalidName" }, { status: 400 });
  }

  const result = await asProfile(session.profile_id, (client) =>
    client.query(
      "update profiles set display_name = $1, updated_at = now() where id = $2 returning display_name",
      [displayName, session.profile_id],
    ),
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ ok: false, error: "notFound" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, displayName: result.rows[0].display_name });
}
