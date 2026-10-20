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
 * The handle is not here on purpose. It is the identity: it appears in URLs
 * and it is what people type to sign in, so changing it is a separate,
 * deliberate thing - not a field on a form.
 */

export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function problem(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function PATCH(request: Request) {
  const profile = await currentProfile();
  if (!profile) return problem("notSignedIn", 401);

  let body: { displayName?: unknown; email?: unknown };
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

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, email })
      .eq("id", profile.id)
      .select("display_name")
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
      email,
    });
  } catch (error) {
    console.error("profile update failed", error);
    return problem("server", 500);
  }
}
