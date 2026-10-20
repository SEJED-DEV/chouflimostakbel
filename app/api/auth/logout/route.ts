import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Sign out.
 *
 * The refresh token is revoked, not just forgotten: signing out on this
 * device ends this device's session at GoTrue, so a copy of the cookie taken
 * before the button was pressed is worth nothing afterwards.
 *
 * "local" rather than "global" - signing out of one phone should not sign
 * you out of the others.
 */
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut({ scope: "local" });
  } catch (error) {
    // A failure here still leaves the reader signed out in their own
    // browser, because the cookies are gone either way.
    console.error("logout failed", error);
  }

  return NextResponse.json({ ok: true });
}
