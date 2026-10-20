import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  authEmailForHandle,
  handleFromAuthEmail,
  normaliseHandle,
} from "@/lib/auth";
import { tooMany, callerKey } from "@/lib/rate-limit";

/**
 * Sign in.
 *
 * A reader types their **handle** and their password. Supabase Auth needs an
 * address to check a password against, so the handle is turned into the
 * synthetic one lib/auth.ts builds - the reader never sees it.
 *
 * An address also works, if they gave one when they signed up: it is looked
 * up, mapped back to the handle, and the same thing happens.
 *
 * Every failure gives the same answer. Whether the handle does not exist,
 * the password is wrong, or the account is somehow broken, the reader is
 * told "invalid" and nothing else. They cannot use this endpoint to work
 * out which usernames are taken.
 */

export const dynamic = "force-dynamic";

function problem(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(request: Request) {
  let body: { identifier?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return problem("invalid", 400);
  }

  const identifier =
    typeof body.identifier === "string" ? body.identifier.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!identifier || !password) return problem("invalid", 400);

  if (tooMany(callerKey(request, "login"), 10, 15 * 60 * 1000)) {
    return problem("rate", 429);
  }

  try {
    const supabase = await createClient();

    // Work out which address GoTrue should be asked about.
    let authEmail: string | null;

    if (identifier.includes("@")) {
      const ours = handleFromAuthEmail(identifier);
      if (ours) {
        authEmail = authEmailForHandle(ours);
      } else {
        // A real address. Find the handle it belongs to.
        //
        // This reads a row the caller does not own, so it cannot go through
        // the signed-in client - there is no session yet, and the policies
        // would refuse it. It is the server asking on its own behalf, and
        // the only thing it does with the answer is try a password against
        // it. Nothing about the row comes back to the caller.
        const { data } = await createAdminClient()
          .from("profiles")
          .select("handle")
          .eq("email", identifier.toLowerCase())
          .maybeSingle();

        authEmail = data ? authEmailForHandle(data.handle) : null;
      }
    } else {
      authEmail = authEmailForHandle(normaliseHandle(identifier));
    }

    if (!authEmail) return problem("invalidCredentials", 401);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password,
    });

    // Wrong handle and wrong password both land here, and both are answered
    // the same way.
    if (error || !data.user) return problem("invalidCredentials", 401);

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, handle, display_name, email, verified_at")
      .eq("id", data.user.id)
      .maybeSingle();

    return NextResponse.json({
      ok: true,
      profile: profile
        ? {
            id: profile.id,
            handle: profile.handle,
            displayName: profile.display_name,
            email: profile.email,
            verified: profile.verified_at !== null,
          }
        : null,
    });
  } catch (error) {
    console.error("login failed", error);
    return problem("server", 500);
  }
}
