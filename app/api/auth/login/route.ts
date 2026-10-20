import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { startSession } from "@/lib/auth";
import { tooMany, callerKey } from "@/lib/rate-limit";

/**
 * Sign in.
 *
 * The identifier is the handle, or the address if the reader gave one. A
 * wrong identifier and a wrong password give the same answer, so the form
 * cannot be used to find out who has an account.
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
    typeof body.identifier === "string" ? body.identifier.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!identifier || !password) return problem("wrongCredentials", 401);

  // Brute force protection. Deliberately generous for a family of people
  // behind one address, and it slows a script down by orders of magnitude.
  if (tooMany(callerKey(request, "login"), 20, 15 * 60 * 1000)) {
    return problem("rate", 429);
  }

  try {
    const result = await db().query("select * from app.verify_password($1, $2)", [
      identifier,
      password,
    ]);

    if (result.rows.length === 0) {
      return problem("wrongCredentials", 401);
    }

    const row = result.rows[0];
    await startSession(row.profile_id as string, request);

    return NextResponse.json({
      ok: true,
      profile: {
        id: row.profile_id,
        handle: row.profile_handle,
        displayName: row.profile_display_name,
        email: row.profile_email,
        verified: Boolean(row.profile_verified_at),
      },
    });
  } catch (error) {
    console.error("login failed", error);
    return problem("server", 500);
  }
}
